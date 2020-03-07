--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: commons_rebuild; Type: SCHEMA; Schema: -; Owner: commons_dev
--

CREATE SCHEMA commons_rebuild;


ALTER SCHEMA commons_rebuild OWNER TO commons_dev;

--
-- Name: postgraphile_watch; Type: SCHEMA; Schema: -; Owner: commons_dev
--

CREATE SCHEMA postgraphile_watch;


ALTER SCHEMA postgraphile_watch OWNER TO commons_dev;

--
-- Name: notify_watchers_ddl(); Type: FUNCTION; Schema: postgraphile_watch; Owner: commons_dev
--

CREATE FUNCTION postgraphile_watch.notify_watchers_ddl() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'ddl',
      'payload',
      (select json_agg(json_build_object('schema', schema_name, 'command', command_tag)) from pg_event_trigger_ddl_commands() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_ddl() OWNER TO commons_dev;

--
-- Name: notify_watchers_drop(); Type: FUNCTION; Schema: postgraphile_watch; Owner: commons_dev
--

CREATE FUNCTION postgraphile_watch.notify_watchers_drop() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
begin
  perform pg_notify(
    'postgraphile_watch',
    json_build_object(
      'type',
      'drop',
      'payload',
      (select json_agg(distinct x.schema_name) from pg_event_trigger_dropped_objects() as x)
    )::text
  );
end;
$$;


ALTER FUNCTION postgraphile_watch.notify_watchers_drop() OWNER TO commons_dev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO commons_dev;

--
-- Name: bill_categories; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.bill_categories (
    id bigint NOT NULL,
    bill_id bigint NOT NULL,
    category_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.bill_categories OWNER TO commons_dev;

--
-- Name: bill_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.bill_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bill_categories_id_seq OWNER TO commons_dev;

--
-- Name: bill_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.bill_categories_id_seq OWNED BY public.bill_categories.id;


--
-- Name: bill_users; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.bill_users (
    id bigint NOT NULL,
    bill_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.bill_users OWNER TO commons_dev;

--
-- Name: bill_users_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.bill_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bill_users_id_seq OWNER TO commons_dev;

--
-- Name: bill_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.bill_users_id_seq OWNED BY public.bill_users.id;


--
-- Name: bills; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.bills (
    id bigint NOT NULL,
    parliamentary_session_id bigint NOT NULL,
    code character varying,
    title character varying,
    description character varying,
    introduced_date date,
    summary_url character varying,
    page_url character varying,
    full_text_url character varying,
    passed boolean,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.bills OWNER TO commons_dev;

--
-- Name: bills_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.bills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bills_id_seq OWNER TO commons_dev;

--
-- Name: bills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.bills_id_seq OWNED BY public.bills.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying,
    uclassify_class character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO commons_dev;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO commons_dev;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: category_users; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.category_users (
    id bigint NOT NULL,
    category_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.category_users OWNER TO commons_dev;

--
-- Name: category_users_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.category_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_users_id_seq OWNER TO commons_dev;

--
-- Name: category_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.category_users_id_seq OWNED BY public.category_users.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.events (
    id bigint NOT NULL,
    bill_id bigint NOT NULL,
    code character varying,
    title character varying,
    publication_date date,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.events OWNER TO commons_dev;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO commons_dev;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: parliamentary_sessions; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.parliamentary_sessions (
    id bigint NOT NULL,
    number integer,
    start_date date,
    end_date date,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.parliamentary_sessions OWNER TO commons_dev;

--
-- Name: parliamentary_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.parliamentary_sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parliamentary_sessions_id_seq OWNER TO commons_dev;

--
-- Name: parliamentary_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.parliamentary_sessions_id_seq OWNED BY public.parliamentary_sessions.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO commons_dev;

--
-- Name: users; Type: TABLE; Schema: public; Owner: commons_dev
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying,
    username character varying,
    password_digest character varying,
    email character varying,
    phone_number character varying,
    postal_code character varying,
    email_notification boolean,
    sms_notification boolean,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO commons_dev;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: commons_dev
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO commons_dev;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: commons_dev
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bill_categories id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_categories ALTER COLUMN id SET DEFAULT nextval('public.bill_categories_id_seq'::regclass);


--
-- Name: bill_users id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_users ALTER COLUMN id SET DEFAULT nextval('public.bill_users_id_seq'::regclass);


--
-- Name: bills id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bills ALTER COLUMN id SET DEFAULT nextval('public.bills_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: category_users id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.category_users ALTER COLUMN id SET DEFAULT nextval('public.category_users_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: parliamentary_sessions id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.parliamentary_sessions ALTER COLUMN id SET DEFAULT nextval('public.parliamentary_sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: bill_categories bill_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_categories
    ADD CONSTRAINT bill_categories_pkey PRIMARY KEY (id);


--
-- Name: bill_users bill_users_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_users
    ADD CONSTRAINT bill_users_pkey PRIMARY KEY (id);


--
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_users category_users_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.category_users
    ADD CONSTRAINT category_users_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: parliamentary_sessions parliamentary_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.parliamentary_sessions
    ADD CONSTRAINT parliamentary_sessions_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_bill_categories_on_bill_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_bill_categories_on_bill_id ON public.bill_categories USING btree (bill_id);


--
-- Name: index_bill_categories_on_category_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_bill_categories_on_category_id ON public.bill_categories USING btree (category_id);


--
-- Name: index_bill_users_on_bill_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_bill_users_on_bill_id ON public.bill_users USING btree (bill_id);


--
-- Name: index_bill_users_on_user_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_bill_users_on_user_id ON public.bill_users USING btree (user_id);


--
-- Name: index_bills_on_parliamentary_session_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_bills_on_parliamentary_session_id ON public.bills USING btree (parliamentary_session_id);


--
-- Name: index_category_users_on_category_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_category_users_on_category_id ON public.category_users USING btree (category_id);


--
-- Name: index_category_users_on_user_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_category_users_on_user_id ON public.category_users USING btree (user_id);


--
-- Name: index_events_on_bill_id; Type: INDEX; Schema: public; Owner: commons_dev
--

CREATE INDEX index_events_on_bill_id ON public.events USING btree (bill_id);


--
-- Name: bill_categories fk_rails_24f4453d74; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_categories
    ADD CONSTRAINT fk_rails_24f4453d74 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: category_users fk_rails_7a83022a53; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.category_users
    ADD CONSTRAINT fk_rails_7a83022a53 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: bill_users fk_rails_7e2824c500; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_users
    ADD CONSTRAINT fk_rails_7e2824c500 FOREIGN KEY (bill_id) REFERENCES public.bills(id);


--
-- Name: category_users fk_rails_7ff4e8abc3; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.category_users
    ADD CONSTRAINT fk_rails_7ff4e8abc3 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: bill_categories fk_rails_82bf41c426; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_categories
    ADD CONSTRAINT fk_rails_82bf41c426 FOREIGN KEY (bill_id) REFERENCES public.bills(id);


--
-- Name: events fk_rails_8b9a75b260; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_rails_8b9a75b260 FOREIGN KEY (bill_id) REFERENCES public.bills(id);


--
-- Name: bills fk_rails_ab6b5aa15b; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT fk_rails_ab6b5aa15b FOREIGN KEY (parliamentary_session_id) REFERENCES public.parliamentary_sessions(id);


--
-- Name: bill_users fk_rails_dd5f4bae79; Type: FK CONSTRAINT; Schema: public; Owner: commons_dev
--

ALTER TABLE ONLY public.bill_users
    ADD CONSTRAINT fk_rails_dd5f4bae79 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: postgraphile_watch_ddl; Type: EVENT TRIGGER; Schema: -; Owner: commons_dev
--

CREATE EVENT TRIGGER postgraphile_watch_ddl ON ddl_command_end
         WHEN TAG IN ('ALTER AGGREGATE', 'ALTER DOMAIN', 'ALTER EXTENSION', 'ALTER FOREIGN TABLE', 'ALTER FUNCTION', 'ALTER POLICY', 'ALTER SCHEMA', 'ALTER TABLE', 'ALTER TYPE', 'ALTER VIEW', 'COMMENT', 'CREATE AGGREGATE', 'CREATE DOMAIN', 'CREATE EXTENSION', 'CREATE FOREIGN TABLE', 'CREATE FUNCTION', 'CREATE INDEX', 'CREATE POLICY', 'CREATE RULE', 'CREATE SCHEMA', 'CREATE TABLE', 'CREATE TABLE AS', 'CREATE VIEW', 'DROP AGGREGATE', 'DROP DOMAIN', 'DROP EXTENSION', 'DROP FOREIGN TABLE', 'DROP FUNCTION', 'DROP INDEX', 'DROP OWNED', 'DROP POLICY', 'DROP RULE', 'DROP SCHEMA', 'DROP TABLE', 'DROP TYPE', 'DROP VIEW', 'GRANT', 'REVOKE', 'SELECT INTO')
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_ddl();


ALTER EVENT TRIGGER postgraphile_watch_ddl OWNER TO commons_dev;

--
-- Name: postgraphile_watch_drop; Type: EVENT TRIGGER; Schema: -; Owner: commons_dev
--

CREATE EVENT TRIGGER postgraphile_watch_drop ON sql_drop
   EXECUTE FUNCTION postgraphile_watch.notify_watchers_drop();


ALTER EVENT TRIGGER postgraphile_watch_drop OWNER TO commons_dev;

--
-- PostgreSQL database dump complete
--

