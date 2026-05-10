
-- ============== ROLES ==============
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== UPDATED_AT TRIGGER ==============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============== AGENT APPLICATIONS ==============
CREATE TYPE public.application_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.agent_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  agency_name TEXT,
  license_number TEXT,
  years_experience INT,
  bio TEXT,
  service_areas TEXT[],
  headshot_url TEXT,
  status public.application_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  temp_password_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users view own application" ON public.agent_applications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users create own application" ON public.agent_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own pending application" ON public.agent_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "admins view all applications" ON public.agent_applications
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update applications" ON public.agent_applications
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_agent_applications_updated
  BEFORE UPDATE ON public.agent_applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============== AGENT PROFILES ==============
CREATE TABLE public.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  bio TEXT,
  service_areas TEXT[],
  photo_url TEXT,
  agency_name TEXT,
  verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone views agent profiles" ON public.agent_profiles
  FOR SELECT USING (true);
CREATE POLICY "agent updates own profile" ON public.agent_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "admins manage agent profiles" ON public.agent_profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_agent_profiles_updated
  BEFORE UPDATE ON public.agent_profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============== FAVORITES ==============
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, property_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============== TOUR REQUESTS ==============
CREATE TYPE public.tour_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE public.tour_mode AS ENUM ('in_person', 'video');

CREATE TABLE public.tour_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  mode public.tour_mode NOT NULL DEFAULT 'in_person',
  notes TEXT,
  status public.tour_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tour_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users view own tours" ON public.tour_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users create own tours" ON public.tour_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins and agents view all tours" ON public.tour_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));
CREATE POLICY "admins and agents update tours" ON public.tour_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE TRIGGER trg_tour_requests_updated
  BEFORE UPDATE ON public.tour_requests
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============== OFFERS ==============
CREATE TYPE public.offer_status AS ENUM ('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE public.financing_type AS ENUM ('cash', 'mortgage', 'installments', 'other');

CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  offer_amount NUMERIC NOT NULL,
  financing public.financing_type NOT NULL,
  down_payment NUMERIC,
  timeline TEXT,
  contingencies TEXT,
  message TEXT,
  status public.offer_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users view own offers" ON public.offers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users create own offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users withdraw own offers" ON public.offers
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "admins and agents view all offers" ON public.offers
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));
CREATE POLICY "admins and agents update offers" ON public.offers
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE TRIGGER trg_offers_updated
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
