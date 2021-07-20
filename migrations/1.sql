EATE DATABASE express_crm

CREATE EXTENSION IF NOT EXISTS hstore WITH SCHEMA public;

CREATE TABLE public.activities (
    id integer NOT NULL,
    action text NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    contact_id integer NOT NULL,
    user_id integer NOT NULL
);

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.contacts (
    id integer NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email public.hstore,
    phonenumber public.hstore,
    user_id integer NOT NULL
);

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.logs (
    id integer NOT NULL,
    "user" text,
    date date,
    url text,
    log public.hstore,
    "time" text
);

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.users (
    id integer NOT NULL,
    client_name text NOT NULL,
    passkey text NOT NULL,
    email text NOT NULL
);

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;

