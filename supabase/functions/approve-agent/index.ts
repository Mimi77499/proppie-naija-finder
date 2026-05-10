import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateTempPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = upper + lower + digits + symbols;
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  let pwd = pick(upper) + pick(lower) + pick(digits) + pick(symbols);
  for (let i = 0; i < 10; i++) pwd += pick(all);
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { applicationId } = await req.json();
    if (!applicationId) {
      return new Response(JSON.stringify({ error: "applicationId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: app, error: appErr } = await admin
      .from("agent_applications").select("*").eq("id", applicationId).single();
    if (appErr || !app) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (app.status === "approved") {
      return new Response(JSON.stringify({ error: "Already approved" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tempPassword = generateTempPassword();
    let agentUserId = app.user_id as string | null;

    // Create or fetch the auth user
    if (!agentUserId) {
      const { data: existing } = await admin.auth.admin.listUsers();
      const found = existing?.users?.find((u) => u.email?.toLowerCase() === app.email.toLowerCase());
      if (found) {
        agentUserId = found.id;
        await admin.auth.admin.updateUserById(found.id, { password: tempPassword });
      } else {
        const { data: created, error: cErr } = await admin.auth.admin.createUser({
          email: app.email, password: tempPassword, email_confirm: true,
          user_metadata: { full_name: app.full_name },
        });
        if (cErr || !created.user) {
          return new Response(JSON.stringify({ error: cErr?.message || "User creation failed" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        agentUserId = created.user.id;
      }
    } else {
      await admin.auth.admin.updateUserById(agentUserId, { password: tempPassword });
    }

    // Grant agent role (idempotent)
    await admin.from("user_roles").upsert(
      { user_id: agentUserId, role: "agent" },
      { onConflict: "user_id,role" },
    );

    // Create agent profile (upsert by user_id)
    await admin.from("agent_profiles").upsert({
      user_id: agentUserId,
      display_name: app.full_name,
      phone: app.phone,
      email: app.email,
      bio: app.bio,
      service_areas: app.service_areas,
      photo_url: app.headshot_url,
      agency_name: app.agency_name,
      verified: true,
    }, { onConflict: "user_id" });

    // Mark application approved
    await admin.from("agent_applications").update({
      status: "approved",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      user_id: agentUserId,
    }).eq("id", applicationId);

    return new Response(JSON.stringify({
      success: true,
      tempPassword,
      email: app.email,
      agentUserId,
      message: "Agent approved. Share the temporary password with the new agent so they can log in and change it.",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});