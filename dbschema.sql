-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age text,
  gender text,
  breed text,
  color text,
  status text DEFAULT 'Available'::text,
  image_url text,
  traits ARRAY,
  CONSTRAINT cats_pkey PRIMARY KEY (id)
);
CREATE TABLE public.guides (
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  category_label text,
  image_url text,
  CONSTRAINT guides_pkey PRIMARY KEY (slug)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.threads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  category text,
  author_name text,
  created_at timestamp with time zone DEFAULT now(),
  replies_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  CONSTRAINT threads_pkey PRIMARY KEY (id)
);
CREATE TABLE public.veterinarians (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text,
  rating numeric,
  reviews_count integer DEFAULT 0,
  address text,
  phone text,
  hours text,
  features ARRAY,
  distance text,
  CONSTRAINT veterinarians_pkey PRIMARY KEY (id)
);