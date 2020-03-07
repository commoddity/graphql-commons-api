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
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	development	2020-03-04 18:13:05.605075	2020-03-04 18:13:05.605075
schema_sha1	aa6d7ec1a52834750da1938bc08e839c3fb87706	2020-03-04 18:13:05.615656	2020-03-04 18:13:05.615656
\.


--
-- Data for Name: bill_categories; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.bill_categories (id, bill_id, category_id, created_at, updated_at) FROM stdin;
1	1	8	2020-03-04 18:17:42.125111	2020-03-04 18:17:42.125111
2	2	12	2020-03-04 18:17:45.610997	2020-03-04 18:17:45.610997
3	4	12	2020-03-04 18:17:48.658865	2020-03-04 18:17:48.658865
4	5	12	2020-03-04 18:17:54.096044	2020-03-04 18:17:54.096044
5	6	12	2020-03-04 18:17:57.366818	2020-03-04 18:17:57.366818
6	7	12	2020-03-04 18:18:00.590062	2020-03-04 18:18:00.590062
7	7	7	2020-03-04 18:18:00.603323	2020-03-04 18:18:00.603323
8	7	14	2020-03-04 18:18:00.609924	2020-03-04 18:18:00.609924
9	8	12	2020-03-04 18:18:04.789136	2020-03-04 18:18:04.789136
10	9	12	2020-03-04 18:18:07.716812	2020-03-04 18:18:07.716812
11	10	12	2020-03-04 18:18:14.05119	2020-03-04 18:18:14.05119
12	11	12	2020-03-04 18:18:17.28774	2020-03-04 18:18:17.28774
13	12	1	2020-03-04 18:18:21.294583	2020-03-04 18:18:21.294583
14	12	7	2020-03-04 18:18:21.309142	2020-03-04 18:18:21.309142
15	13	4	2020-03-04 18:18:24.38223	2020-03-04 18:18:24.38223
16	13	12	2020-03-04 18:18:24.396618	2020-03-04 18:18:24.396618
17	13	7	2020-03-04 18:18:24.410443	2020-03-04 18:18:24.410443
18	14	1	2020-03-04 18:18:27.370824	2020-03-04 18:18:27.370824
19	14	14	2020-03-04 18:18:27.383035	2020-03-04 18:18:27.383035
20	14	9	2020-03-04 18:18:27.389773	2020-03-04 18:18:27.389773
21	15	1	2020-03-04 18:18:30.520651	2020-03-04 18:18:30.520651
22	15	7	2020-03-04 18:18:30.544145	2020-03-04 18:18:30.544145
23	15	12	2020-03-04 18:18:30.553221	2020-03-04 18:18:30.553221
24	15	9	2020-03-04 18:18:30.563549	2020-03-04 18:18:30.563549
25	15	14	2020-03-04 18:18:30.575264	2020-03-04 18:18:30.575264
26	16	12	2020-03-04 18:18:33.918934	2020-03-04 18:18:33.918934
27	16	8	2020-03-04 18:18:33.932877	2020-03-04 18:18:33.932877
28	16	14	2020-03-04 18:18:33.941331	2020-03-04 18:18:33.941331
29	16	11	2020-03-04 18:18:33.946797	2020-03-04 18:18:33.946797
30	16	7	2020-03-04 18:18:33.957893	2020-03-04 18:18:33.957893
31	17	14	2020-03-04 18:18:37.152771	2020-03-04 18:18:37.152771
32	18	14	2020-03-04 18:18:40.148508	2020-03-04 18:18:40.148508
33	19	12	2020-03-04 18:18:43.832965	2020-03-04 18:18:43.832965
34	20	4	2020-03-04 18:18:46.983652	2020-03-04 18:18:46.983652
35	20	7	2020-03-04 18:18:47.003471	2020-03-04 18:18:47.003471
36	20	9	2020-03-04 18:18:47.015497	2020-03-04 18:18:47.015497
37	20	12	2020-03-04 18:18:47.02351	2020-03-04 18:18:47.02351
38	21	14	2020-03-04 18:18:50.05304	2020-03-04 18:18:50.05304
39	21	7	2020-03-04 18:18:50.068915	2020-03-04 18:18:50.068915
40	21	12	2020-03-04 18:18:50.078325	2020-03-04 18:18:50.078325
41	22	12	2020-03-04 18:18:53.297239	2020-03-04 18:18:53.297239
42	23	4	2020-03-04 18:18:56.902312	2020-03-04 18:18:56.902312
43	23	12	2020-03-04 18:18:56.914592	2020-03-04 18:18:56.914592
44	24	12	2020-03-04 18:19:00.125599	2020-03-04 18:19:00.125599
45	24	4	2020-03-04 18:19:00.14054	2020-03-04 18:19:00.14054
46	25	12	2020-03-04 18:19:03.609756	2020-03-04 18:19:03.609756
47	26	12	2020-03-04 18:19:06.648297	2020-03-04 18:19:06.648297
48	27	12	2020-03-04 18:19:13.633634	2020-03-04 18:19:13.633634
49	28	12	2020-03-04 18:19:16.683661	2020-03-04 18:19:16.683661
50	29	9	2020-03-04 18:19:19.671366	2020-03-04 18:19:19.671366
51	29	14	2020-03-04 18:19:19.684778	2020-03-04 18:19:19.684778
52	30	3	2020-03-04 18:19:23.426478	2020-03-04 18:19:23.426478
53	30	4	2020-03-04 18:19:23.444125	2020-03-04 18:19:23.444125
54	30	1	2020-03-04 18:19:23.450236	2020-03-04 18:19:23.450236
55	30	11	2020-03-04 18:19:23.461446	2020-03-04 18:19:23.461446
56	31	7	2020-03-04 18:19:27.554798	2020-03-04 18:19:27.554798
57	31	1	2020-03-04 18:19:27.572263	2020-03-04 18:19:27.572263
58	31	14	2020-03-04 18:19:27.58079	2020-03-04 18:19:27.58079
59	32	12	2020-03-04 18:19:30.908789	2020-03-04 18:19:30.908789
60	33	12	2020-03-04 18:19:36.470367	2020-03-04 18:19:36.470367
61	34	12	2020-03-04 18:19:40.510431	2020-03-04 18:19:40.510431
62	35	12	2020-03-04 18:19:43.642124	2020-03-04 18:19:43.642124
63	35	8	2020-03-04 18:19:43.662145	2020-03-04 18:19:43.662145
64	35	4	2020-03-04 18:19:43.668543	2020-03-04 18:19:43.668543
65	36	12	2020-03-04 18:19:46.707241	2020-03-04 18:19:46.707241
66	37	13	2020-03-04 18:19:49.710155	2020-03-04 18:19:49.710155
67	37	12	2020-03-04 18:19:49.727672	2020-03-04 18:19:49.727672
68	38	12	2020-03-04 18:19:53.449606	2020-03-04 18:19:53.449606
69	39	12	2020-03-04 18:19:56.754663	2020-03-04 18:19:56.754663
70	40	8	2020-03-04 18:19:59.819097	2020-03-04 18:19:59.819097
71	40	7	2020-03-04 18:19:59.829555	2020-03-04 18:19:59.829555
72	41	12	2020-03-04 18:20:02.888523	2020-03-04 18:20:02.888523
73	42	12	2020-03-04 18:20:06.004347	2020-03-04 18:20:06.004347
74	43	12	2020-03-04 18:20:09.107274	2020-03-04 18:20:09.107274
75	44	12	2020-03-04 18:20:12.208729	2020-03-04 18:20:12.208729
76	45	12	2020-03-04 18:20:16.629719	2020-03-04 18:20:16.629719
77	46	12	2020-03-04 18:20:19.809003	2020-03-04 18:20:19.809003
78	47	7	2020-03-04 18:20:22.791418	2020-03-04 18:20:22.791418
79	47	1	2020-03-04 18:20:22.809948	2020-03-04 18:20:22.809948
80	47	9	2020-03-04 18:20:22.822134	2020-03-04 18:20:22.822134
81	47	4	2020-03-04 18:20:22.829205	2020-03-04 18:20:22.829205
82	47	12	2020-03-04 18:20:22.838107	2020-03-04 18:20:22.838107
83	47	11	2020-03-04 18:20:22.847289	2020-03-04 18:20:22.847289
84	47	2	2020-03-04 18:20:22.855423	2020-03-04 18:20:22.855423
85	48	1	2020-03-04 18:20:26.038491	2020-03-04 18:20:26.038491
86	49	12	2020-03-04 18:20:29.100328	2020-03-04 18:20:29.100328
87	50	7	2020-03-04 18:20:32.184073	2020-03-04 18:20:32.184073
88	51	7	2020-03-04 18:20:35.456512	2020-03-04 18:20:35.456512
89	52	12	2020-03-04 18:20:38.836944	2020-03-04 18:20:38.836944
90	53	7	2020-03-04 18:20:41.96172	2020-03-04 18:20:41.96172
91	53	14	2020-03-04 18:20:41.983601	2020-03-04 18:20:41.983601
92	53	5	2020-03-04 18:20:41.990098	2020-03-04 18:20:41.990098
93	54	12	2020-03-04 18:20:44.987033	2020-03-04 18:20:44.987033
94	55	14	2020-03-04 18:20:48.027308	2020-03-04 18:20:48.027308
95	55	7	2020-03-04 18:20:48.041195	2020-03-04 18:20:48.041195
96	55	8	2020-03-04 18:20:48.064053	2020-03-04 18:20:48.064053
97	55	5	2020-03-04 18:20:48.075441	2020-03-04 18:20:48.075441
98	55	9	2020-03-04 18:20:48.09642	2020-03-04 18:20:48.09642
99	56	12	2020-03-04 18:20:51.234791	2020-03-04 18:20:51.234791
100	56	7	2020-03-04 18:20:51.25511	2020-03-04 18:20:51.25511
101	56	1	2020-03-04 18:20:51.261712	2020-03-04 18:20:51.261712
102	56	14	2020-03-04 18:20:51.272007	2020-03-04 18:20:51.272007
103	57	12	2020-03-04 18:20:54.705071	2020-03-04 18:20:54.705071
104	59	7	2020-03-04 18:20:57.99192	2020-03-04 18:20:57.99192
105	60	12	2020-03-04 18:21:01.402233	2020-03-04 18:21:01.402233
106	61	12	2020-03-04 18:21:04.495216	2020-03-04 18:21:04.495216
107	3	8	2020-03-04 18:21:08.831974	2020-03-04 18:21:08.831974
108	3	12	2020-03-04 18:21:08.851874	2020-03-04 18:21:08.851874
109	58	7	2020-03-04 18:21:14.232197	2020-03-04 18:21:14.232197
110	58	4	2020-03-04 18:21:14.246647	2020-03-04 18:21:14.246647
\.


--
-- Data for Name: bill_users; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.bill_users (id, bill_id, user_id, created_at, updated_at) FROM stdin;
166	3	1	2020-03-05 08:20:15.624702	2020-03-05 08:20:15.624702
167	33	1	2020-03-05 08:20:18.372927	2020-03-05 08:20:18.372927
177	12	1	2020-03-05 19:31:34.050474	2020-03-05 19:31:34.050474
178	16	1	2020-03-05 19:31:42.304497	2020-03-05 19:31:42.304497
180	4	1	2020-03-05 19:42:35.069357	2020-03-05 19:42:35.069357
181	14	1	2020-03-05 19:42:42.901178	2020-03-05 19:42:42.901178
184	8	1	2020-03-06 00:44:19.367276	2020-03-06 00:44:19.367276
185	11	1	2020-03-06 00:44:26.524817	2020-03-06 00:44:26.524817
186	13	1	2020-03-06 03:09:58.629461	2020-03-06 03:09:58.629461
142	18	1	2020-03-05 07:45:47.154991	2020-03-05 07:45:47.154991
103	10	1	2020-03-05 07:31:52.207305	2020-03-05 07:31:52.207305
158	9	1	2020-03-05 07:51:49.443278	2020-03-05 07:51:49.443278
162	20	1	2020-03-05 07:52:35.730288	2020-03-05 07:52:35.730288
163	36	1	2020-03-05 07:52:47.430146	2020-03-05 07:52:47.430146
\.


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.bills (id, parliamentary_session_id, code, title, description, introduced_date, summary_url, page_url, full_text_url, passed, created_at, updated_at) FROM stdin;
1	1	C-237	An Act to establish a national framework for diabetes	This enactment provides for the development of a national framework designed to support improved access for Canadians to diabetes prevention and treatment.	2020-02-27	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10660264	https://parl.ca/DocumentViewer/en/10670705	\N	2020-03-04 18:17:03.265999	2020-03-04 18:17:03.265999
2	1	C-7	An Act to amend the Criminal Code (medical assistance in dying)	This enactment amends the Criminal Code to, among other things,	2020-02-24	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10648716	https://parl.ca/DocumentViewer/en/10655190	\N	2020-03-04 18:17:03.291675	2020-03-04 18:17:03.291675
4	1	C-238	An Act to amend the Criminal Code (possession of unlawfully imported firearms)	This enactment amends the Criminal Code to provide that a person who is charged with an offence in respect of the possession of a firearm that is alleged to have been unlawfully imported into Canada is required to demonstrate that their pre-trial detention is not justified. It also increases the mandatory minimum penalty for the possession of such weapons.	2020-02-27	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10660265	https://parl.ca/DocumentViewer/en/10670352	\N	2020-03-04 18:17:03.34572	2020-03-04 18:17:03.34572
5	1	C-4	An Act to implement the Agreement between Canada, the United States of America and the United Mexican States	This enactment implements the Agreement between Canada, the United States of America and the United Mexican States, done at Buenos Aires on November 30, 2018, as amended by the Protocol of Amendment to that Agreement, done at Mexico City on December 10, 2019.	2020-01-29	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10615191	https://parl.ca/DocumentViewer/en/10617993	\N	2020-03-04 18:17:03.37177	2020-03-04 18:17:03.37177
6	1	S-211	An Act to enact the Modern Slavery Act and to amend the Customs Tariff	This enactment enacts the Modern Slavery Act, which imposes an obligation on certain entities to report on the measures taken to prevent and reduce the risk that forced labour or child labour is used at any step in the production of goods in Canada or elsewhere by the entity or in the production of goods imported into Canada. The Act provides for an inspection regime and gives the Minister the power to require an entity to provide certain information.	2020-02-05	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10627038	https://parl.ca/DocumentViewer/en/10627049	\N	2020-03-04 18:17:03.40407	2020-03-04 18:17:03.40407
7	1	S-209	An Act to amend the Department for Women and Gender Equality Act	This enactment amends the Department for Women and Gender Equality Act to require the Minister for Women and Gender Equality to examine the potential effects of certain bills and amendments on women and to report to Parliament accordingly.	2020-02-04	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10625194	https://parl.ca/DocumentViewer/en/10625197	\N	2020-03-04 18:17:03.425536	2020-03-04 18:17:03.425536
8	1	C-236	An Act to amend the Controlled Drugs and Substances Act (evidence-based diversion measures)	This enactment amends the Controlled Drugs and Substances Act to require peace officers to consider measures other than judicial proceedings to deal with individuals alleged to have been in possession of certain substances. It also sets out principles to be taken into account in the determination of the most appropriate measures to take.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10653513	https://parl.ca/DocumentViewer/en/10668005	\N	2020-03-04 18:17:03.460889	2020-03-04 18:17:03.460889
9	1	C-235	An Act to amend the Controlled Drugs and Substances Act and to make consequential amendments to other Acts	This enactment amends the Controlled Drugs and Substances Act to repeal a provision that makes it an offence to possess certain substances.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10627497	https://parl.ca/DocumentViewer/en/10667977	\N	2020-03-04 18:17:03.496211	2020-03-04 18:17:03.496211
10	1	C-234	An Act to amend the Income Tax Act (home security measures)	This enactment amends the Income Tax Act in order to establish the home security tax credit.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10653514	https://parl.ca/DocumentViewer/en/10667954	\N	2020-03-04 18:17:03.524012	2020-03-04 18:17:03.524012
11	1	C-233	An Act to amend the Criminal Code (sex-selective abortion)	This enactment amends the Criminal Code to make it an offence for a medical practitioner to perform an abortion knowing that the abortion is sought solely on the grounds of the child’s genetic sex. It also requires the Minister of Health, after consultation with representatives of the provincial governments responsible for health, to establish guidelines respecting information provided by a medical practitioner in relation to a request for an abortion.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10655161	https://parl.ca/DocumentViewer/en/10667952	\N	2020-03-04 18:17:03.559064	2020-03-04 18:17:03.559064
12	1	C-232	An Act respecting a Climate Emergency Action Framework	This enactment provides for the development and implementation of a climate emergency action framework.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10652306	https://parl.ca/DocumentViewer/en/10667930	\N	2020-03-04 18:17:03.582166	2020-03-04 18:17:03.582166
13	1	C-231	An Act to amend the Canada Pension Plan Investment Board Act (investments)	This enactment amends the Canada Pension Plan Investment Board Act to specify that the investment policies, standards and procedures established by the board of directors shall provide that no investment may be made or held in any entity that engages in certain practices.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10652229	https://parl.ca/DocumentViewer/en/10667882	\N	2020-03-04 18:17:03.611483	2020-03-04 18:17:03.611483
14	1	C-230	An Act respecting the development of a national strategy to redress environmental racism	This enactment requires the Minister of the Environment, in consultation with representatives of provincial and municipal governments, of Indigenous communities and of other affected communities, to develop a national strategy to promote efforts across Canada to redress the harm caused by environmental racism. It also provides for reporting requirements in relation to the strategy.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10653234	https://parl.ca/DocumentViewer/en/10667857	\N	2020-03-04 18:17:03.635809	2020-03-04 18:17:03.635809
15	1	C-229	An Act to repeal certain restrictions on shipping	This enactment repeals the Oil Tanker Moratorium Act.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10653714	https://parl.ca/DocumentViewer/en/10667691	\N	2020-03-04 18:17:03.660544	2020-03-04 18:17:03.660544
16	1	C-228	An Act to establish a federal framework to reduce recidivism	This enactment provides for the development and implementation of a federal framework to reduce recidivism.	2020-02-26	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637615	https://parl.ca/DocumentViewer/en/10667493	\N	2020-03-04 18:17:03.685412	2020-03-04 18:17:03.685412
17	1	C-227	An Act to amend the Employment Equity Act	This enactment amends the Employment Equity Act to provide that the lesbian, gay, bisexual, transgender, queer and two-spirit communities are included in the designated groups for the purposes of the Act.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10604052	https://parl.ca/DocumentViewer/en/10659097	\N	2020-03-04 18:17:03.715571	2020-03-04 18:17:03.715571
18	1	C-226	An Act to amend the Canadian Multiculturalism Act (non-application in Quebec)	This enactment amends the Canadian Multiculturalism Act to provide that it does not apply in Quebec.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10641190	https://parl.ca/DocumentViewer/en/10658948	\N	2020-03-04 18:17:03.73952	2020-03-04 18:17:03.73952
19	1	C-225	An Act to amend the Aeronautics Act, the Fishing and Recreational Harbours Act and other Acts (application of provincial law)	This enactment amends certain acts to subordinate the exercise of certain powers to the applicable provincial laws concerning land use and development and environmental protection.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10638081	https://parl.ca/DocumentViewer/en/10658587	\N	2020-03-04 18:17:03.76671	2020-03-04 18:17:03.76671
20	1	C-224	An Act to amend An Act to authorize the making of certain fiscal payments to provinces, and to authorize the entry into tax collection agreements with provinces	This enactment amends An Act to authorize the making of certain fiscal payments to provinces, and to authorize the entry into tax collection agreements with provinces to provide that the Minister of Finance may enter into an agreement with the government of a province under which the government of the province will collect the federal personal and corporation income taxes on behalf of the Government of Canada. It also requires that the Minister of Finance undertake discussions with the Government of Quebec in order to enter into such an agreement.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10613955	https://parl.ca/DocumentViewer/en/10658648	\N	2020-03-04 18:17:03.791751	2020-03-04 18:17:03.791751
21	1	C-223	An Act to amend the Citizenship Act (adequate knowledge of French in Quebec)	This enactment amends the Citizenship Act to require that permanent residents who ordinarily reside in Quebec must have an adequate knowledge of French in order to obtain citizenship.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637930	https://parl.ca/DocumentViewer/en/10658713	\N	2020-03-04 18:17:03.819636	2020-03-04 18:17:03.819636
22	1	C-222	An Act to amend the Expropriation Act (protection of private property)	This enactment amends the Expropriation Act to provide that the power of the Governor in Council to waive the requirement for a public hearing in respect of an objection to the intended expropriation of an interest in land or immovable real right may not be exercised in certain circumstances.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10649347	https://parl.ca/DocumentViewer/en/10658423	\N	2020-03-04 18:17:03.846634	2020-03-04 18:17:03.846634
23	1	C-221	An Act to amend the Income Tax Act (oil and gas wells)	This enactment amends the Income Tax Act to establish a tax credit for the closure of oil and gas wells. It also sets out a requirement for the Minister of Finance to make an assessment respecting the implementation of possible tax incentives for the closure of oil and gas wells.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10639683	https://parl.ca/DocumentViewer/en/10658439	\N	2020-03-04 18:17:03.880599	2020-03-04 18:17:03.880599
24	1	C-220	An Act to amend the Canada Labour Code (compassionate care leave)	This enactment amends the Canada Labour Code to extend the period during which an employee may take compassionate care leave.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10643700	https://parl.ca/DocumentViewer/en/10658158	\N	2020-03-04 18:17:03.912699	2020-03-04 18:17:03.912699
25	1	C-219	An Act to amend the Criminal Code (sexual exploitation)	This enactment amends the Criminal Code to increase sentences for offences of sexual exploitation and to add as an aggravating circumstance the fact that the victim is a person with a disability for the purpose of sentencing.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10640078	https://parl.ca/DocumentViewer/en/10658255	\N	2020-03-04 18:17:03.951068	2020-03-04 18:17:03.951068
26	1	C-218	An Act to amend the Criminal Code (sports betting)	This enactment repeals paragraph 207(4)‍(b) of the Criminal Code to make it lawful for the government of a province, or a person or entity licensed by the Lieutenant Governor in Council of that province, to conduct and manage a lottery scheme in the province that involves betting on a race or fight or on a single sport event or athletic contest.	2020-02-25	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10639805	https://parl.ca/DocumentViewer/en/10658201	\N	2020-03-04 18:17:03.981776	2020-03-04 18:17:03.981776
27	1	S-208	An Act to amend the Criminal Code (independence of the judiciary)	This enactment amends the Criminal Code to give a court the discretion to vary the punishment to be imposed in respect of an offence for which the punishment or different degrees or kinds of punishment is prescribed in an enactment.	2020-02-04	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10625187	https://parl.ca/DocumentViewer/en/10625190	\N	2020-03-04 18:17:04.012398	2020-03-04 18:17:04.012398
28	1	S-207	An Act to amend the Criminal Code (disclosure of information by jurors)	This enactment amends the Criminal Code to provide that the prohibition against the disclosure of information relating to jury proceedings does not, in certain circumstances, apply in respect of disclosure by jurors to health care professionals.	2019-12-12	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10607221	https://parl.ca/DocumentViewer/en/10607236	\N	2020-03-04 18:17:04.028415	2020-03-04 18:17:04.028415
29	1	C-6	An Act to amend the Citizenship Act (Truth and Reconciliation Commission of Canada's call to action number 94)	This enactment amends the Citizenship Act to include, in the Oath or Affirmation of Citizenship, a solemn promise to respect the Aboriginal and treaty rights of First Nations, Inuit and Métis peoples, in order to respond to the Truth and Reconciliation Commission of Canada’s call to action number 94.	2020-02-18	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10635353	https://parl.ca/DocumentViewer/en/10637729	\N	2020-03-04 18:17:04.043828	2020-03-04 18:17:04.043828
30	1	C-216	An Act to amend the Department of Foreign Affairs, Trade and Development Act (supply management)	This enactment amends the Department of Foreign Affairs, Trade and Development Act so that the Minister of Foreign Affairs cannot make certain commitments with respect to international trade regarding certain goods.	2020-02-24	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10638080	https://parl.ca/DocumentViewer/en/10655334	\N	2020-03-04 18:17:04.056034	2020-03-04 18:17:04.056034
31	1	C-215	An Act respecting Canada’s fulfillment of its greenhouse gas emissions reduction obligations	This enactment enacts the Climate Change Accountability Act, which provides for the development of an action plan to ensure that Canada fulfills its obligations under the Paris Agreement, including by means of targets for reducing Canadian greenhouse gas emissions and accountability mechanisms for emissions reduction.	2020-02-24	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10646797	https://parl.ca/DocumentViewer/en/10655437	\N	2020-03-04 18:17:04.069899	2020-03-04 18:17:04.069899
32	1	C-214	An Act to amend the Income Tax Act (qualifying environmental trust)	This enactment amends the Income Tax Act to include, in the definition “qualifying environmental trust”, trusts that are maintained for the sole purpose of funding the reclamation of an oil or gas well operated for the purpose of producing petroleum or natural gas.	2020-02-24	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10646385	https://parl.ca/DocumentViewer/en/10655180	\N	2020-03-04 18:17:04.082039	2020-03-04 18:17:04.082039
33	1	C-213	An Act to enact the Canada Pharmacare Act	This enactment enacts the Canada Pharmacare Act, which establishes criteria and conditions in respect of drug insurance plans established under the law of a province that must be met before a cash contribution may be made.	2020-02-24	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10635416	https://parl.ca/DocumentViewer/en/10655417	\N	2020-03-04 18:17:04.095213	2020-03-04 18:17:04.095213
34	1	C-3	An Act to amend the Royal Canadian Mounted Police Act and the Canada Border Services Agency Act and to make consequential amendments to other Acts	This enactment amends the Royal Canadian Mounted Police Act to, among other things, rename the Civilian Review and Complaints Commission for the Royal Canadian Mounted Police as the Public Complaints and Review Commission. It also amends the Canada Border Services Agency Act to, among other things, grant to that Commission powers, duties and functions in relation to the Canada Border Services Agency, including the power to conduct a review of the activities of that Agency and to investigate complaints concerning the conduct of any of that Agency’s officers or employees. It also makes consequential amendments to other Acts.	2020-01-27	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10613928	https://parl.ca/DocumentViewer/en/10615687	\N	2020-03-04 18:17:04.110959	2020-03-04 18:17:04.110959
35	1	C-212	An Act to amend the Employment Insurance Act (special benefits)	This enactment amends the Employment Insurance Act to extend the maximum period for which benefits for illness, injury or quarantine may be paid from 15 weeks to 50.	2020-02-20	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10638140	https://parl.ca/DocumentViewer/en/10642700	\N	2020-03-04 18:17:04.12577	2020-03-04 18:17:04.12577
36	1	C-211	An Act to amend the Criminal Code (assaults against health care professionals and first responders)	This enactment amends the Criminal Code to require a court to consider the fact that the victim of an assault is a health care professional or a first responder to be an aggravating circumstance for the purposes of sentencing.	2020-02-20	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10636919	https://parl.ca/DocumentViewer/en/10642965	\N	2020-03-04 18:17:04.138362	2020-03-04 18:17:04.138362
37	1	S-216	An Act to amend the Assisted Human Reproduction Act	This enactment amends the Assisted Human Reproduction Act to decriminalize payment for sperm or ovum donation and for surrogacy in certain circumstances.	2020-02-20	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10644036	https://parl.ca/DocumentViewer/en/10644072	\N	2020-03-04 18:17:04.150738	2020-03-04 18:17:04.150738
38	1	S-214	An Act to amend the Criminal Records Act, to make consequential amendments to other Acts and to repeal a regulation	This enactment amends the Criminal Records Act to provide for the expiry of criminal records.	2020-02-18	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637473	https://parl.ca/DocumentViewer/en/10637493	\N	2020-03-04 18:17:04.162013	2020-03-04 18:17:04.162013
39	1	C-5	An Act to amend the Judges Act and the Criminal Code	This enactment amends the Judges Act to restrict eligibility for judicial appointment to persons who undertake to participate in continuing education on matters related to sexual assault law and social context. It also amends the Judges Act to require that the Canadian Judicial Council report on seminars offered for the continuing education of judges on matters related to sexual assault law. Finally, it amends the Criminal Code to require that judges provide reasons for decisions in sexual assault proceedings.	2020-02-04	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10620333	https://parl.ca/DocumentViewer/en/10623769	\N	2020-03-04 18:17:04.173858	2020-03-04 18:17:04.173858
40	1	C-210	An Act to amend the Canada Revenue Agency Act (organ and tissue donors)	This enactment amends the Canada Revenue Agency Act to authorize the Canada Revenue Agency to enter into an agreement with a province or a territory regarding the collection and disclosure of information required for establishing or maintaining an organ and tissue donor registry in the province or territory.	2020-02-19	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10613677	https://parl.ca/DocumentViewer/en/10640476	\N	2020-03-04 18:17:04.187173	2020-03-04 18:17:04.187173
41	1	C-209	An Act to amend the Copyright Act (Crown copyright)	This enactment amends the Copyright Act to specify that, without prejudice to any rights or privileges of the Crown, no copyright subsists in any work that is, or has been, prepared or published by or under the direction or control of Her Majesty or any government department.	2020-02-19	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10614052	https://parl.ca/DocumentViewer/en/10641140	\N	2020-03-04 18:17:04.203041	2020-03-04 18:17:04.203041
42	1	C-208	An Act to amend the Income Tax Act (transfer of small business or family farm or fishing corporation)	This enactment amends the Income Tax Act in order to provide that, in the case of qualified small business corporation shares and shares of the capital stock of a family farm or fishing corporation, siblings are deemed not to be dealing at arm’s length and to be related, and that, under certain conditions, the transfer of those shares by a taxpayer to the taxpayer’s child or grandchild who is 18 years of age or older is to be excluded from the anti-avoidance rule of section 84.‍1.	2020-02-19	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10629636	https://parl.ca/DocumentViewer/en/10641046	\N	2020-03-04 18:17:04.217123	2020-03-04 18:17:04.217123
43	1	C-207	An Act to amend the Criminal Code (presentence report)	This enactment amends the Criminal Code to require that a presentence report contain information on any aspect of the offender’s mental condition that is relevant for sentencing purposes.	2020-02-19	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10616863	https://parl.ca/DocumentViewer/en/10641078	\N	2020-03-04 18:17:04.23473	2020-03-04 18:17:04.23473
44	1	C-206	An Act to amend the Greenhouse Gas Pollution Pricing Act (qualifying farming fuel)	This enactment amends the Greenhouse Gas Pollution Pricing Act to extend the exemption for qualifying farming fuel to marketable natural gas and propane.	2020-02-18	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10635301	https://parl.ca/DocumentViewer/en/10637202	\N	2020-03-04 18:17:04.246388	2020-03-04 18:17:04.246388
45	1	C-205	An Act to amend the Health of Animals Act	This enactment amends the Health of Animals Act to make it an offence to enter, without lawful authority or excuse, a place in which animals are kept if doing so could result in the exposure of the animals to a disease or toxic substance that is capable of affecting or contaminating them.	2020-02-18	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10630862	https://parl.ca/DocumentViewer/en/10637353	\N	2020-03-04 18:17:04.261553	2020-03-04 18:17:04.261553
46	1	S-215	An Act to amend the Greenhouse Gas Pollution Pricing Act (farming exemptions)	This enactment amends the Greenhouse Gas Pollution Pricing Act to modify the definitions of eligible farming machinery and qualifying farming fuel.	2020-02-18	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637436	https://parl.ca/DocumentViewer/en/10637457	\N	2020-03-04 18:17:04.273763	2020-03-04 18:17:04.273763
47	1	S-206	An Act to amend the Department of Public Works and Government Services Act (use of wood)	This enactment amends the Department of Public Works and Government Services Act to require that the Minister may, in developing requirements for public works, allow the use of wood or any other thing that achieves environmental benefits.	2019-12-11	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10605962	https://parl.ca/DocumentViewer/en/10605976	\N	2020-03-04 18:17:04.286199	2020-03-04 18:17:04.286199
48	1	C-204	An Act to amend the Canadian Environmental Protection Act, 1999 (final disposal of plastic waste)	This enactment amends the Canadian Environmental Protection Act, 1999 to prohibit the export of certain types of plastic waste to foreign countries for final disposal.	2020-02-07	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10626760	https://parl.ca/DocumentViewer/en/10633126	\N	2020-03-04 18:17:04.299714	2020-03-04 18:17:04.299714
49	1	C-203	An Act to amend the National Defence Act (maiming or injuring self or another)	This enactment amends the National Defence Act to repeal the offence of maiming or injuring oneself or another person to render oneself or that other person unfit for service.	2020-02-06	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10604049	https://parl.ca/DocumentViewer/en/10628940	\N	2020-03-04 18:17:04.312846	2020-03-04 18:17:04.312846
50	1	S-213	An Act to change the name of the electoral district of Châteauguay—Lacolle	This enactment changes the name of the electoral district of Châteauguay—Lacolle to “Châteauguay—Les Jardins-de-Napierville”.	2020-02-06	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10629396	https://parl.ca/DocumentViewer/en/10629408	\N	2020-03-04 18:17:04.334978	2020-03-04 18:17:04.334978
51	1	S-210	An Act to amend the Parliament of Canada Act (Parliamentary Visual Artist Laureate)	This enactment creates the position of Parliamentary Visual Artist Laureate. It also corrects a reference to the Canada Council for the Arts in the English version of the Parliament of Canada Act.	2020-02-04	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10625169	https://parl.ca/DocumentViewer/en/10625253	\N	2020-03-04 18:17:04.349488	2020-03-04 18:17:04.349488
52	1	S-1001	An Act respecting Girl Guides of Canada	This enactment replaces An Act to Incorporate The Canadian Council of The Girl Guides Association, chapter 77 of the Statutes of Canada, 1917, with a new Act that continues the corporation known as “Girl Guides of Canada” and makes changes relating to its administration.	2020-02-05	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10627060	https://parl.ca/DocumentViewer/en/10627064	\N	2020-03-04 18:17:04.362123	2020-03-04 18:17:04.362123
53	1	S-212	An Act to establish International Mother Language Day	This enactment designates the 21st day of February in each and every year as “International Mother Language Day”.	2020-02-05	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10627090	https://parl.ca/DocumentViewer/en/10627117	\N	2020-03-04 18:17:04.372335	2020-03-04 18:17:04.372335
54	1	C-202	An Act to amend the Criminal Code (assault against a health care worker)	This enactment amends the Criminal Code to require a court to consider the fact that the victim of an assault is a health care worker to be an aggravating circumstance for the purposes of sentencing.	2020-02-04	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10618751	https://parl.ca/DocumentViewer/en/10624971	\N	2020-03-04 18:17:04.385806	2020-03-04 18:17:04.385806
55	1	C-201	An Act to develop a national school food program for children	This enactment provides for the development of a national school food program to ensure that all children in Canada have access to healthy food.	2020-02-04	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10618763	https://parl.ca/DocumentViewer/en/10624785	\N	2020-03-04 18:17:04.393785	2020-03-04 18:17:04.393785
56	1	S-203	An Act to amend the National Capital Act (buildings or works of national significance)	This enactment amends the National Capital Act to establish certain requirements related to the erection, alteration, extension or demolition of certain buildings or other works within the National Capital Region.	2019-12-10	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10604419	https://parl.ca/DocumentViewer/en/10604421	\N	2020-03-04 18:17:04.40139	2020-03-04 18:17:04.40139
57	1	S-202	An Act to amend the Criminal Code (conversion therapy)	This enactment amends the Criminal Code to make it an offence to advertise conversion therapy services for consideration and to obtain a financial or other material benefit for the provision of conversion therapy to a person under the age of eighteen.	2019-12-10	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10604397	https://parl.ca/DocumentViewer/en/10604403	\N	2020-03-04 18:17:04.412464	2020-03-04 18:17:04.412464
59	1	S-205	An Act to amend the Constitution Act, 1867 and the Parliament of Canada Act (Speaker of the Senate)	This enactment amends the Constitution Act, 1867 to provide for the election of the Speaker and the Deputy Speaker of the Senate and their participation in votes.	2019-12-11	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10605949	https://parl.ca/DocumentViewer/en/10605951	\N	2020-03-04 18:17:04.432193	2020-03-04 18:17:04.432193
60	1	S-204	An Act to amend the Criminal Code and the Immigration and Refugee Protection Act (trafficking in human organs)	This enactment amends the Criminal Code to create new offences in relation to trafficking in human organs. It also amends the Immigratiand Refugee Protection Act to provide that a permanent resident or foreign national is inadmissible to Canada if the Minister of Citizenship and Immigration is of the opinion that they have engaged in any activities relating to trafficking in human organs.	2019-12-10	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10604425	https://parl.ca/DocumentViewer/en/10604427	\N	2020-03-04 18:17:04.440048	2020-03-04 18:17:04.440048
61	1	S-201	An Act to amend the Borrowing Authority Act	This enactment amends the Borrowing Authority Act to limit the circumstances in which the Governor in Council may authorize the borrowing of money without legislative approval.	2019-12-10	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10604365	https://parl.ca/DocumentViewer/en/10604382	\N	2020-03-04 18:17:04.452046	2020-03-04 18:17:04.452046
62	1	C-1	An Act respecting the administration of oaths of office	\N	2019-12-05	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10600395	\N	\N	2020-03-04 18:17:04.459966	2020-03-04 18:17:04.459966
63	1	S-1	An Act relating to railways	\N	2019-12-05	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10601138	\N	\N	2020-03-04 18:17:04.46724	2020-03-04 18:17:04.46724
3	1	C-217	An Act to amend the Employment Insurance Act (illness, injury or quarantine)	This enactment amends the Employment Insurance Act to increase from 15 to 50 the maximum number of weeks for which benefits may be paid because of illness, injury or quarantine.	2020-02-24	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10639072	https://parl.ca/DocumentViewer/en/10656973	f	2020-03-04 18:17:03.318564	2020-03-04 18:17:05.547025
58	1	C-2	An Act for granting to Her Majesty certain sums of money for the federal public administration for the fiscal year ending March 31, 2020	This enactment grants the sum of $4,855,257,827 towards defraying charges and expenses of the federal public administration for the fiscal year ending March 31, 2020 that are not otherwise provided for.	\N	\N	https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10604308	https://parl.ca/DocumentViewer/en/10608070	t	2020-03-04 18:17:04.424537	2020-03-04 18:17:05.670981
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.categories (id, name, uclassify_class, created_at, updated_at) FROM stdin;
1	Agriculture, environment, fisheries and natural resources	agriculture_environment	2020-03-04 18:13:06.073373	2020-03-04 18:13:06.073373
2	Arts, culture and entertainment	arts_culture	2020-03-04 18:13:06.083594	2020-03-04 18:13:06.083594
3	Business, industry and trade	business_industry	2020-03-04 18:13:06.098846	2020-03-04 18:13:06.098846
4	Economics and finance	economics_finance	2020-03-04 18:13:06.114151	2020-03-04 18:13:06.114151
5	Education, language and training	education_language	2020-03-04 18:13:06.125927	2020-03-04 18:13:06.125927
6	Employment and labour	employment_labour	2020-03-04 18:13:06.135491	2020-03-04 18:13:06.135491
7	Government, Parliament and politics	government_politics	2020-03-04 18:13:06.142476	2020-03-04 18:13:06.142476
8	Health and safety	health_safety	2020-03-04 18:13:06.149547	2020-03-04 18:13:06.149547
9	Indigenous affairs	indigenous_affairs	2020-03-04 18:13:06.156673	2020-03-04 18:13:06.156673
10	Information and communications	information_communications	2020-03-04 18:13:06.163996	2020-03-04 18:13:06.163996
11	International affairs and defence	international_affairs	2020-03-04 18:13:06.171178	2020-03-04 18:13:06.171178
12	Law, justice and rights	law_justice	2020-03-04 18:13:06.177919	2020-03-04 18:13:06.177919
13	Science and technology	science_technology	2020-03-04 18:13:06.184884	2020-03-04 18:13:06.184884
14	Social affairs and population	social_affairs	2020-03-04 18:13:06.191874	2020-03-04 18:13:06.191874
\.


--
-- Data for Name: category_users; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.category_users (id, category_id, user_id, created_at, updated_at) FROM stdin;
9	1	2	2020-03-04 19:04:20.387363	2020-03-04 19:04:20.387363
10	5	2	2020-03-04 19:04:20.39527	2020-03-04 19:04:20.39527
11	6	2	2020-03-04 19:04:20.40417	2020-03-04 19:04:20.40417
12	10	2	2020-03-04 19:04:20.412096	2020-03-04 19:04:20.412096
13	14	2	2020-03-04 19:04:20.420338	2020-03-04 19:04:20.420338
14	1	1	2020-03-05 02:33:20.755828	2020-03-05 02:33:20.755828
15	2	1	2020-03-05 02:33:20.765511	2020-03-05 02:33:20.765511
16	3	1	2020-03-05 02:33:20.772275	2020-03-05 02:33:20.772275
17	4	1	2020-03-05 02:33:20.779736	2020-03-05 02:33:20.779736
18	5	1	2020-03-05 02:33:20.786397	2020-03-05 02:33:20.786397
19	6	1	2020-03-05 02:33:20.792935	2020-03-05 02:33:20.792935
20	8	1	2020-03-05 02:33:20.799703	2020-03-05 02:33:20.799703
21	11	1	2020-03-05 02:33:20.8078	2020-03-05 02:33:20.8078
22	13	1	2020-03-05 02:33:20.818524	2020-03-05 02:33:20.818524
23	14	1	2020-03-05 02:33:20.831121	2020-03-05 02:33:20.831121
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.events (id, bill_id, code, title, publication_date, created_at, updated_at) FROM stdin;
1	1	C-237	Placed in the Order of Precedence in the House of Commons	2020-02-28	2020-03-04 18:17:04.49154	2020-03-04 18:17:04.49154
2	2	C-7	Debate at Second Reading in the House of Commons	2020-02-27	2020-03-04 18:17:04.501989	2020-03-04 18:17:04.501989
3	3	C-217	Bill Not Proceeded With in the House of Commons	2020-02-27	2020-03-04 18:17:04.510289	2020-03-04 18:17:04.510289
4	4	C-238	Introduction and First Reading in the House of Commons	2020-02-27	2020-03-04 18:17:04.51989	2020-03-04 18:17:04.51989
5	1	C-237	Introduction and First Reading in the House of Commons	2020-02-27	2020-03-04 18:17:04.527052	2020-03-04 18:17:04.527052
6	5	C-4	Committee Reporting the Bill without Amendment in the House of Commons	2020-02-27	2020-03-04 18:17:04.533544	2020-03-04 18:17:04.533544
7	6	S-211	Debate at Second Reading in the Senate	2020-02-27	2020-03-04 18:17:04.540538	2020-03-04 18:17:04.540538
8	7	S-209	Debate at Second Reading in the Senate	2020-02-27	2020-03-04 18:17:04.552541	2020-03-04 18:17:04.552541
9	2	C-7	Debate at Second Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.563116	2020-03-04 18:17:04.563116
10	8	C-236	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.572192	2020-03-04 18:17:04.572192
11	9	C-235	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.581198	2020-03-04 18:17:04.581198
12	10	C-234	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.590618	2020-03-04 18:17:04.590618
13	11	C-233	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.597343	2020-03-04 18:17:04.597343
14	12	C-232	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.603614	2020-03-04 18:17:04.603614
15	13	C-231	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.610226	2020-03-04 18:17:04.610226
16	14	C-230	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.620743	2020-03-04 18:17:04.620743
17	15	C-229	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.63058	2020-03-04 18:17:04.63058
18	16	C-228	Introduction and First Reading in the House of Commons	2020-02-26	2020-03-04 18:17:04.637457	2020-03-04 18:17:04.637457
19	17	C-227	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.647036	2020-03-04 18:17:04.647036
20	18	C-226	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.658978	2020-03-04 18:17:04.658978
21	19	C-225	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.666081	2020-03-04 18:17:04.666081
22	20	C-224	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.672366	2020-03-04 18:17:04.672366
23	21	C-223	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.682494	2020-03-04 18:17:04.682494
24	22	C-222	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.692195	2020-03-04 18:17:04.692195
25	23	C-221	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.699101	2020-03-04 18:17:04.699101
26	24	C-220	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.705503	2020-03-04 18:17:04.705503
27	25	C-219	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.715912	2020-03-04 18:17:04.715912
28	26	C-218	Introduction and First Reading in the House of Commons	2020-02-25	2020-03-04 18:17:04.726444	2020-03-04 18:17:04.726444
29	7	S-209	Debate at Second Reading in the Senate	2020-02-25	2020-03-04 18:17:04.736028	2020-03-04 18:17:04.736028
30	27	S-208	Debate at Second Reading in the Senate	2020-02-25	2020-03-04 18:17:04.744789	2020-03-04 18:17:04.744789
31	28	S-207	Debate at Second Reading in the Senate	2020-02-25	2020-03-04 18:17:04.75309	2020-03-04 18:17:04.75309
32	6	S-211	Debate at Second Reading in the Senate	2020-02-25	2020-03-04 18:17:04.75876	2020-03-04 18:17:04.75876
33	29	C-6	Debate at Second Reading in the House of Commons	2020-02-24	2020-03-04 18:17:04.765183	2020-03-04 18:17:04.765183
34	2	C-7	Introduction and First Reading in the House of Commons	2020-02-24	2020-03-04 18:17:04.771193	2020-03-04 18:17:04.771193
35	3	C-217	Introduction and First Reading in the House of Commons	2020-02-24	2020-03-04 18:17:04.777563	2020-03-04 18:17:04.777563
36	30	C-216	Introduction and First Reading in the House of Commons	2020-02-24	2020-03-04 18:17:04.784154	2020-03-04 18:17:04.784154
37	31	C-215	Introduction and First Reading in the House of Commons	2020-02-24	2020-03-04 18:17:04.791649	2020-03-04 18:17:04.791649
38	32	C-214	Introduction and First Reading in the House of Commons	2020-02-24	2020-03-04 18:17:04.801795	2020-03-04 18:17:04.801795
39	33	C-213	Introduction and First Reading in the House of Commons	2020-02-24	2020-03-04 18:17:04.809888	2020-03-04 18:17:04.809888
40	34	C-3	Debate at Second Reading in the House of Commons	2020-02-21	2020-03-04 18:17:04.818818	2020-03-04 18:17:04.818818
41	5	C-4	Pre-Study of Commons Bill in the Senate	2020-02-21	2020-03-04 18:17:04.825139	2020-03-04 18:17:04.825139
42	35	C-212	Introduction and First Reading in the House of Commons	2020-02-20	2020-03-04 18:17:04.831391	2020-03-04 18:17:04.831391
43	36	C-211	Introduction and First Reading in the House of Commons	2020-02-20	2020-03-04 18:17:04.837623	2020-03-04 18:17:04.837623
44	37	S-216	Introduction and First Reading in the Senate	2020-02-20	2020-03-04 18:17:04.843481	2020-03-04 18:17:04.843481
45	38	S-214	Debate at Second Reading in the Senate	2020-02-20	2020-03-04 18:17:04.849717	2020-03-04 18:17:04.849717
46	39	C-5	Second Reading and Referral to Committee in the House of Commons	2020-02-19	2020-03-04 18:17:04.85769	2020-03-04 18:17:04.85769
47	40	C-210	Introduction and First Reading in the House of Commons	2020-02-19	2020-03-04 18:17:04.868234	2020-03-04 18:17:04.868234
48	41	C-209	Introduction and First Reading in the House of Commons	2020-02-19	2020-03-04 18:17:04.875329	2020-03-04 18:17:04.875329
49	42	C-208	Introduction and First Reading in the House of Commons	2020-02-19	2020-03-04 18:17:04.885102	2020-03-04 18:17:04.885102
50	43	C-207	Introduction and First Reading in the House of Commons	2020-02-19	2020-03-04 18:17:04.891955	2020-03-04 18:17:04.891955
51	39	C-5	Debate at Second Reading in the House of Commons	2020-02-19	2020-03-04 18:17:04.898282	2020-03-04 18:17:04.898282
52	27	S-208	Debate at Second Reading in the Senate	2020-02-19	2020-03-04 18:17:04.904835	2020-03-04 18:17:04.904835
53	44	C-206	Introduction and First Reading in the House of Commons	2020-02-18	2020-03-04 18:17:04.910773	2020-03-04 18:17:04.910773
54	45	C-205	Introduction and First Reading in the House of Commons	2020-02-18	2020-03-04 18:17:04.917271	2020-03-04 18:17:04.917271
55	29	C-6	Introduction and First Reading in the House of Commons	2020-02-18	2020-03-04 18:17:04.925033	2020-03-04 18:17:04.925033
56	46	S-215	Introduction and First Reading in the Senate	2020-02-18	2020-03-04 18:17:04.938036	2020-03-04 18:17:04.938036
57	38	S-214	Introduction and First Reading in the Senate	2020-02-18	2020-03-04 18:17:04.946474	2020-03-04 18:17:04.946474
58	27	S-208	Debate at Second Reading in the Senate	2020-02-18	2020-03-04 18:17:04.954399	2020-03-04 18:17:04.954399
59	7	S-209	Debate at Second Reading in the Senate	2020-02-18	2020-03-04 18:17:04.960674	2020-03-04 18:17:04.960674
60	6	S-211	Debate at Second Reading in the Senate	2020-02-18	2020-03-04 18:17:04.966813	2020-03-04 18:17:04.966813
61	47	S-206	Debate at Second Reading in the Senate	2020-02-18	2020-03-04 18:17:04.973164	2020-03-04 18:17:04.973164
62	48	C-204	Introduction and First Reading in the House of Commons	2020-02-07	2020-03-04 18:17:04.98056	2020-03-04 18:17:04.98056
63	34	C-3	Debate at Second Reading in the House of Commons	2020-02-07	2020-03-04 18:17:04.996987	2020-03-04 18:17:04.996987
64	5	C-4	Second Reading and Referral to Committee in the House of Commons	2020-02-06	2020-03-04 18:17:05.011978	2020-03-04 18:17:05.011978
65	34	C-3	Debate at Second Reading in the House of Commons	2020-02-06	2020-03-04 18:17:05.019959	2020-03-04 18:17:05.019959
66	5	C-4	Debate at Second Reading in the House of Commons	2020-02-06	2020-03-04 18:17:05.026746	2020-03-04 18:17:05.026746
67	49	C-203	Introduction and First Reading in the House of Commons	2020-02-06	2020-03-04 18:17:05.033119	2020-03-04 18:17:05.033119
68	50	S-213	Introduction and First Reading in the Senate	2020-02-06	2020-03-04 18:17:05.039299	2020-03-04 18:17:05.039299
69	51	S-210	Debate at Second Reading in the Senate	2020-02-06	2020-03-04 18:17:05.045882	2020-03-04 18:17:05.045882
70	27	S-208	Debate at Second Reading in the Senate	2020-02-06	2020-03-04 18:17:05.052653	2020-03-04 18:17:05.052653
71	28	S-207	Debate at Second Reading in the Senate	2020-02-06	2020-03-04 18:17:05.063579	2020-03-04 18:17:05.063579
72	5	C-4	Debate at Second Reading in the House of Commons	2020-02-05	2020-03-04 18:17:05.073622	2020-03-04 18:17:05.073622
73	52	S-1001	Introduction and First Reading in the Senate	2020-02-05	2020-03-04 18:17:05.086041	2020-03-04 18:17:05.086041
74	6	S-211	Introduction and First Reading in the Senate	2020-02-05	2020-03-04 18:17:05.09468	2020-03-04 18:17:05.09468
75	53	S-212	Introduction and First Reading in the Senate	2020-02-05	2020-03-04 18:17:05.10103	2020-03-04 18:17:05.10103
76	54	C-202	Introduction and First Reading in the House of Commons	2020-02-04	2020-03-04 18:17:05.110372	2020-03-04 18:17:05.110372
77	55	C-201	Introduction and First Reading in the House of Commons	2020-02-04	2020-03-04 18:17:05.120545	2020-03-04 18:17:05.120545
78	39	C-5	Introduction and First Reading in the House of Commons	2020-02-04	2020-03-04 18:17:05.128419	2020-03-04 18:17:05.128419
79	27	S-208	Introduction and First Reading in the Senate	2020-02-04	2020-03-04 18:17:05.135125	2020-03-04 18:17:05.135125
80	7	S-209	Introduction and First Reading in the Senate	2020-02-04	2020-03-04 18:17:05.145611	2020-03-04 18:17:05.145611
81	51	S-210	Introduction and First Reading in the Senate	2020-02-04	2020-03-04 18:17:05.155423	2020-03-04 18:17:05.155423
82	5	C-4	Debate at Second Reading in the House of Commons	2020-02-03	2020-03-04 18:17:05.16235	2020-03-04 18:17:05.16235
83	5	C-4	Debate at Second Reading in the House of Commons	2020-01-31	2020-03-04 18:17:05.168947	2020-03-04 18:17:05.168947
84	5	C-4	Debate at Second Reading in the House of Commons	2020-01-30	2020-03-04 18:17:05.179283	2020-03-04 18:17:05.179283
85	5	C-4	Introduction and First Reading in the House of Commons	2020-01-29	2020-03-04 18:17:05.193867	2020-03-04 18:17:05.193867
86	34	C-3	Debate at Second Reading in the House of Commons	2020-01-29	2020-03-04 18:17:05.200999	2020-03-04 18:17:05.200999
87	34	C-3	Introduction and First Reading in the House of Commons	2020-01-27	2020-03-04 18:17:05.208464	2020-03-04 18:17:05.208464
88	28	S-207	Introduction and First Reading in the Senate	2019-12-12	2020-03-04 18:17:05.219366	2020-03-04 18:17:05.219366
89	56	S-203	Debate at Second Reading in the Senate	2019-12-12	2020-03-04 18:17:05.227126	2020-03-04 18:17:05.227126
90	57	S-202	Debate at Second Reading in the Senate	2019-12-12	2020-03-04 18:17:05.235859	2020-03-04 18:17:05.235859
91	58	C-2	Royal Assent in the Senate	2019-12-12	2020-03-04 18:17:05.253737	2020-03-04 18:17:05.253737
92	58	C-2	Third Reading in the Senate	2019-12-11	2020-03-04 18:17:05.272227	2020-03-04 18:17:05.272227
93	58	C-2	Debate at 3rd Reading in the Senate	2019-12-11	2020-03-04 18:17:05.299004	2020-03-04 18:17:05.299004
94	58	C-2	Second Reading in the Senate	2019-12-11	2020-03-04 18:17:05.313033	2020-03-04 18:17:05.313033
95	58	C-2	Debate at Second Reading in the Senate	2019-12-11	2020-03-04 18:17:05.333119	2020-03-04 18:17:05.333119
96	47	S-206	Introduction and First Reading in the Senate	2019-12-11	2020-03-04 18:17:05.346945	2020-03-04 18:17:05.346945
97	59	S-205	Introduction and First Reading in the Senate	2019-12-11	2020-03-04 18:17:05.362121	2020-03-04 18:17:05.362121
98	58	C-2	First Reading in the Senate	2019-12-11	2020-03-04 18:17:05.368382	2020-03-04 18:17:05.368382
99	58	C-2	Third Reading in the House of Commons	2019-12-10	2020-03-04 18:17:05.376859	2020-03-04 18:17:05.376859
100	58	C-2	Debate at 3rd Reading in the House of Commons	2019-12-10	2020-03-04 18:17:05.387092	2020-03-04 18:17:05.387092
101	58	C-2	Concurrence at Report Stage in the House of Commons	2019-12-10	2020-03-04 18:17:05.399681	2020-03-04 18:17:05.399681
102	58	C-2	Debate at Report Stage in the House of Commons	2019-12-10	2020-03-04 18:17:05.409861	2020-03-04 18:17:05.409861
103	58	C-2	Committee Reporting the Bill without Amendment in the House of Commons	2019-12-10	2020-03-04 18:17:05.416623	2020-03-04 18:17:05.416623
104	58	C-2	Second Reading and Referral to Committee in the House of Commons	2019-12-10	2020-03-04 18:17:05.423785	2020-03-04 18:17:05.423785
105	58	C-2	Debate at Second Reading in the House of Commons	2019-12-10	2020-03-04 18:17:05.434036	2020-03-04 18:17:05.434036
106	58	C-2	First Reading in the House of Commons	2019-12-10	2020-03-04 18:17:05.442352	2020-03-04 18:17:05.442352
107	60	S-204	Introduction and First Reading in the Senate	2019-12-10	2020-03-04 18:17:05.451039	2020-03-04 18:17:05.451039
108	56	S-203	Introduction and First Reading in the Senate	2019-12-10	2020-03-04 18:17:05.45916	2020-03-04 18:17:05.45916
109	61	S-201	Introduction and First Reading in the Senate	2019-12-10	2020-03-04 18:17:05.474195	2020-03-04 18:17:05.474195
110	57	S-202	Introduction and First Reading in the Senate	2019-12-10	2020-03-04 18:17:05.484729	2020-03-04 18:17:05.484729
111	62	C-1	Introduction and First Reading in the House of Commons	2019-12-05	2020-03-04 18:17:05.49779	2020-03-04 18:17:05.49779
112	63	S-1	Introduction and First Reading in the Senate	2019-12-05	2020-03-04 18:17:05.516028	2020-03-04 18:17:05.516028
\.


--
-- Data for Name: parliamentary_sessions; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.parliamentary_sessions (id, number, start_date, end_date, created_at, updated_at) FROM stdin;
1	1	2019-12-05	\N	2020-03-04 18:13:06.046846	2020-03-04 18:13:06.046846
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.schema_migrations (version) FROM stdin;
20200220183928
20200214204511
20200214234405
20200214234638
20200214234737
20200214235816
20200220183543
20200220183659
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: commons_dev
--

COPY public.users (id, name, username, password_digest, email, phone_number, postal_code, email_notification, sms_notification, created_at, updated_at) FROM stdin;
2	George Strombouloupolous	thisguy55	$2a$12$lsMvC2SK.cUXXXGmUoIKIevPnTOnZKCHjhFtda/6.sT.8iZmk8xZ.	pascal-vanleeuwen@hotmail.com	7789600255	\N	t	t	2020-03-04 19:04:20.364123	2020-03-04 19:04:20.364123
1	Pascal van Leeuwen	commoddity	$2a$12$RE7/e8Hc18TPBLKA8zTqguo4h5vwq185VPGcfxCMYKKjVsbxYl38W	pascalvanleeuwen604@gmail.com	7789600255		t	t	2020-03-04 18:51:41.886091	2020-03-05 02:33:20.685404
\.


--
-- Name: bill_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.bill_categories_id_seq', 110, true);


--
-- Name: bill_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.bill_users_id_seq', 190, true);


--
-- Name: bills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.bills_id_seq', 63, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: category_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.category_users_id_seq', 23, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.events_id_seq', 112, true);


--
-- Name: parliamentary_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.parliamentary_sessions_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: commons_dev
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


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

