# Proppie Naija → Redfin-style rebuild

You picked "everything in one go" — but realistically this is ~40+ files of work. I'll ship it in **two back-to-back rounds in this conversation** so each round is reviewable. Round 1 lands the foundation + the highest-value pieces; Round 2 polishes everything else.

---

## Round 1 (this message)

### 1. Database foundation (one migration)
- `user_roles` table + `app_role` enum (`admin`, `agent`, `user`) + `has_role()` security-definer function
- `agent_applications` — full name, phone, agency, license, bio, areas, headshot, status (`pending`/`approved`/`rejected`), reviewed_by, reviewed_at, rejection_reason
- `agent_profiles` — auto-created on approval (display name, phone, photo, bio, areas, verified)
- `favorites` — saved properties per user
- `tour_requests` — property_id, user, preferred date/time, mode (in-person/video), status
- `offers` — property_id, buyer, offer_amount, financing, timeline, contingencies, status
- RLS on every table

### 2. Header CTA swap
- Replace "Join / Sign in" with two buttons: **Login** and **Become an Agent**
- Mobile menu mirrors

### 3. Agent application flow
- `/become-agent` — multi-step form (personal → professional → areas/bio → review/submit)
- Stores to `agent_applications` (signed-out users get a "create account first" prompt)

### 4. Admin dashboard
- `/admin` route, gated by `has_role(uid, 'admin')`
- Lists pending applications with approve/reject actions
- **Approve** → calls `approve-agent` edge function which:
  - Creates auth user (if not existing) with system-generated temp password
  - Inserts `agent` role + `agent_profile`
  - Sends email with temp password + login link via Lovable Emails (auth template)
- **Reject** → marks rejected, sends rejection email
- Self-promotion: since you said "admin does that from their end," I'll seed it so you can manually flip your own user_id to admin via the database tools after signup, and document it in the admin page empty-state

### 5. Email setup
- Scaffold transactional email templates: `agent-approved` (with temp password + first-login instructions) and `agent-rejected`
- Requires email domain — I'll prompt you to set one up first if not configured

### 6. Property detail upgrades (Redfin-style)
- Save/favorite heart button (persists to `favorites`)
- Share button (copy link + WhatsApp share)
- "Request a Tour" button → modal → writes to `tour_requests`
- "Start an Offer" button → multi-step modal → writes to `offers`
- Payment/mortgage estimator (Naira mortgage calc with down payment, rate, term sliders)
- Price history section (mocked from listing data for now)
- Schools/landmarks section (using existing nearby data)
- Similar homes carousel

### 7. Homepage Redfin-style sections (added below existing hero/feed)
- "Trending Areas in Nigeria" tile grid (Lekki, Ikoyi, VI, Abuja, PH, Ibadan)
- "Recently Added" horizontal scroll
- "Recommended for You" section
- Agent CTA banner ("Are you an agent? Apply now")

---

## Round 2 (immediately after Round 1 lands)

- Property card "Listed X hours/days ago" relative-time tags
- Polished property gallery (Redfin-style large hero + thumbnails + lightbox)
- Filter/sort upgrades on `/properties` (price range, beds, baths, type, sort)
- Climate/environment placeholder section
- Agent-side dashboard (`/agent/dashboard`) so approved agents can manage listings
- Saved properties page (`/saved`)
- Mobile polish pass

---

## Technical notes

- All new routes added above the catch-all in `App.tsx`
- All forms use `zod` validation
- Mortgage estimator is pure client math — no external API
- Email approval flow needs an email domain configured; I'll request that via the email setup dialog if it isn't already
- I will NOT touch existing `Header`/`HeroSection`/`PropertyFeed` styling beyond the button swap and added sections — keeps your current look intact

---

**Reply "go" and I'll start with the migration in Round 1.** If you want me to drop or reorder anything (e.g., skip the offer flow, skip email setup), tell me now before I begin.