--
-- PostgreSQL database dump
--

-- Dumped from database version 11.7 (Ubuntu 11.7-2.pgdg18.04+1)
-- Dumped by pg_dump version 11.7 (Ubuntu 11.7-2.pgdg18.04+1)

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
-- Name: timescaledb; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS timescaledb WITH SCHEMA public;


--
-- Name: EXTENSION timescaledb; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: my_new_point(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.my_new_point() RETURNS trigger
    LANGUAGE plpgsql
    AS $$BEGIN
	NEW.geom := ST_GeomFromText(NEW.wkt_geom, 4326);
RETURN NEW;
END;
$$;


ALTER FUNCTION public.my_new_point() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: observations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observations (
    time_stamp timestamp(6) with time zone NOT NULL,
    observed_value double precision NOT NULL,
    sensor_id bigint NOT NULL,
    phenomena_id bigint NOT NULL,
    ref_sys_id bigint NOT NULL,
    geom public.geometry(Point,4326),
    wkt_geom character varying(200) NOT NULL
);


ALTER TABLE public.observations OWNER TO postgres;

--
-- Name: _hyper_7_38_chunk; Type: TABLE; Schema: _timescaledb_internal; Owner: postgres
--

CREATE TABLE _timescaledb_internal._hyper_7_38_chunk (
    CONSTRAINT constraint_38 CHECK (((time_stamp >= '2020-02-20 02:00:00+02'::timestamp with time zone) AND (time_stamp < '2020-02-27 02:00:00+02'::timestamp with time zone)))
)
INHERITS (public.observations);


ALTER TABLE _timescaledb_internal._hyper_7_38_chunk OWNER TO postgres;

--
-- Name: phenomenons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phenomenons (
    phenomenon_name character varying(100) NOT NULL,
    unit character varying(100) NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.phenomenons OWNER TO postgres;

--
-- Name: phenomenons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.phenomenons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.phenomenons_id_seq OWNER TO postgres;

--
-- Name: phenomenons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.phenomenons_id_seq OWNED BY public.phenomenons.id;


--
-- Name: sensors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensors (
    sensor_name character varying(20) NOT NULL,
    sensor_type character varying(20) NOT NULL,
    sensor_id bigint NOT NULL,
    phenomena_id bigint NOT NULL
);


ALTER TABLE public.sensors OWNER TO postgres;

--
-- Name: sensors_sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensors_sensor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sensors_sensor_id_seq OWNER TO postgres;

--
-- Name: sensors_sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensors_sensor_id_seq OWNED BY public.sensors.sensor_id;


--
-- Name: phenomenons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phenomenons ALTER COLUMN id SET DEFAULT nextval('public.phenomenons_id_seq'::regclass);


--
-- Name: sensors sensor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors ALTER COLUMN sensor_id SET DEFAULT nextval('public.sensors_sensor_id_seq'::regclass);


--
-- Data for Name: cache_inval_bgw_job; Type: TABLE DATA; Schema: _timescaledb_cache; Owner: postgres
--

COPY _timescaledb_cache.cache_inval_bgw_job  FROM stdin;
\.


--
-- Data for Name: cache_inval_extension; Type: TABLE DATA; Schema: _timescaledb_cache; Owner: postgres
--

COPY _timescaledb_cache.cache_inval_extension  FROM stdin;
\.


--
-- Data for Name: cache_inval_hypertable; Type: TABLE DATA; Schema: _timescaledb_cache; Owner: postgres
--

COPY _timescaledb_cache.cache_inval_hypertable  FROM stdin;
\.


--
-- Data for Name: hypertable; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.hypertable (id, schema_name, table_name, associated_schema_name, associated_table_prefix, num_dimensions, chunk_sizing_func_schema, chunk_sizing_func_name, chunk_target_size, compressed, compressed_hypertable_id) FROM stdin;
7	public	observations	_timescaledb_internal	_hyper_7	1	_timescaledb_internal	calculate_chunk_interval	0	f	\N
\.


--
-- Data for Name: chunk; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.chunk (id, hypertable_id, schema_name, table_name, compressed_chunk_id) FROM stdin;
38	7	_timescaledb_internal	_hyper_7_38_chunk	\N
\.


--
-- Data for Name: dimension; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.dimension (id, hypertable_id, column_name, column_type, aligned, num_slices, partitioning_func_schema, partitioning_func, interval_length, integer_now_func_schema, integer_now_func) FROM stdin;
7	7	time_stamp	timestamp with time zone	t	\N	\N	\N	604800000000	\N	\N
\.


--
-- Data for Name: dimension_slice; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.dimension_slice (id, dimension_id, range_start, range_end) FROM stdin;
38	7	1582156800000000	1582761600000000
\.


--
-- Data for Name: chunk_constraint; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.chunk_constraint (chunk_id, dimension_slice_id, constraint_name, hypertable_constraint_name) FROM stdin;
38	38	constraint_38	\N
38	\N	38_149_observations_pkey	observations_pkey
38	\N	38_150_phenomena_ob_fkey	phenomena_ob_fkey
38	\N	38_151_ref_sys_fkey	ref_sys_fkey
38	\N	38_152_sensor_ob_fkey	sensor_ob_fkey
\.


--
-- Data for Name: chunk_index; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.chunk_index (chunk_id, index_name, hypertable_id, hypertable_index_name) FROM stdin;
38	38_149_observations_pkey	7	observations_pkey
38	_hyper_7_38_chunk_fki_sensor_ob_fkey	7	fki_sensor_ob_fkey
38	_hyper_7_38_chunk_fki_phenomena_ob_fkey	7	fki_phenomena_ob_fkey
38	_hyper_7_38_chunk_fki_ref_sys_fkey	7	fki_ref_sys_fkey
\.


--
-- Data for Name: compression_chunk_size; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.compression_chunk_size (chunk_id, compressed_chunk_id, uncompressed_heap_size, uncompressed_toast_size, uncompressed_index_size, compressed_heap_size, compressed_toast_size, compressed_index_size) FROM stdin;
\.


--
-- Data for Name: bgw_job; Type: TABLE DATA; Schema: _timescaledb_config; Owner: postgres
--

COPY _timescaledb_config.bgw_job (id, application_name, job_type, schedule_interval, max_runtime, max_retries, retry_period) FROM stdin;
\.


--
-- Data for Name: continuous_agg; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.continuous_agg (mat_hypertable_id, raw_hypertable_id, user_view_schema, user_view_name, partial_view_schema, partial_view_name, bucket_width, job_id, refresh_lag, direct_view_schema, direct_view_name, max_interval_per_job) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_completed_threshold; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.continuous_aggs_completed_threshold (materialization_id, watermark) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_hypertable_invalidation_log; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.continuous_aggs_hypertable_invalidation_log (hypertable_id, lowest_modified_value, greatest_modified_value) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_invalidation_threshold; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.continuous_aggs_invalidation_threshold (hypertable_id, watermark) FROM stdin;
\.


--
-- Data for Name: continuous_aggs_materialization_invalidation_log; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.continuous_aggs_materialization_invalidation_log (materialization_id, lowest_modified_value, greatest_modified_value) FROM stdin;
\.


--
-- Data for Name: hypertable_compression; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.hypertable_compression (hypertable_id, attname, compression_algorithm_id, segmentby_column_index, orderby_column_index, orderby_asc, orderby_nullsfirst) FROM stdin;
\.


--
-- Data for Name: metadata; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.metadata (key, value, include_in_telemetry) FROM stdin;
exported_uuid	399e0bf9-7b65-4401-b5f1-be06ce2a797c	t
\.


--
-- Data for Name: tablespace; Type: TABLE DATA; Schema: _timescaledb_catalog; Owner: postgres
--

COPY _timescaledb_catalog.tablespace (id, hypertable_id, tablespace_name) FROM stdin;
\.


--
-- Data for Name: bgw_policy_compress_chunks; Type: TABLE DATA; Schema: _timescaledb_config; Owner: postgres
--

COPY _timescaledb_config.bgw_policy_compress_chunks (job_id, hypertable_id, older_than) FROM stdin;
\.


--
-- Data for Name: bgw_policy_drop_chunks; Type: TABLE DATA; Schema: _timescaledb_config; Owner: postgres
--

COPY _timescaledb_config.bgw_policy_drop_chunks (job_id, hypertable_id, older_than, cascade, cascade_to_materializations) FROM stdin;
\.


--
-- Data for Name: bgw_policy_reorder; Type: TABLE DATA; Schema: _timescaledb_config; Owner: postgres
--

COPY _timescaledb_config.bgw_policy_reorder (job_id, hypertable_id, hypertable_index_name) FROM stdin;
\.


--
-- Data for Name: _hyper_7_38_chunk; Type: TABLE DATA; Schema: _timescaledb_internal; Owner: postgres
--

COPY _timescaledb_internal._hyper_7_38_chunk (time_stamp, observed_value, sensor_id, phenomena_id, ref_sys_id, geom, wkt_geom) FROM stdin;
\.


--
-- Data for Name: observations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observations (time_stamp, observed_value, sensor_id, phenomena_id, ref_sys_id, geom, wkt_geom) FROM stdin;
\.


--
-- Data for Name: phenomenons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phenomenons (phenomenon_name, unit, id) FROM stdin;
Temperature	°C	1
Carbon Dioxide pollution	CO2	2
Humidity	mm	3
Wind	M/s	4
Location	lonLat	5
Particulate matter pollution	µg/m3	6
\.


--
-- Data for Name: sensors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sensors (sensor_name, sensor_type, sensor_id, phenomena_id) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Name: chunk_constraint_name; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('_timescaledb_catalog.chunk_constraint_name', 152, true);


--
-- Name: chunk_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('_timescaledb_catalog.chunk_id_seq', 38, true);


--
-- Name: dimension_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('_timescaledb_catalog.dimension_id_seq', 7, true);


--
-- Name: dimension_slice_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('_timescaledb_catalog.dimension_slice_id_seq', 38, true);


--
-- Name: hypertable_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('_timescaledb_catalog.hypertable_id_seq', 7, true);


--
-- Name: bgw_job_id_seq; Type: SEQUENCE SET; Schema: _timescaledb_config; Owner: postgres
--

SELECT pg_catalog.setval('_timescaledb_config.bgw_job_id_seq', 1000, false);


--
-- Name: phenomenons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.phenomenons_id_seq', 6, true);


--
-- Name: sensors_sensor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sensors_sensor_id_seq', 175, true);


--
-- Name: _hyper_7_38_chunk 38_149_observations_pkey; Type: CONSTRAINT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_7_38_chunk
    ADD CONSTRAINT "38_149_observations_pkey" PRIMARY KEY (time_stamp);


--
-- Name: observations observations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_pkey PRIMARY KEY (time_stamp);


--
-- Name: phenomenons phenomenons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phenomenons
    ADD CONSTRAINT phenomenons_pkey PRIMARY KEY (id);


--
-- Name: sensors sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensors_pkey PRIMARY KEY (sensor_id);


--
-- Name: _hyper_7_38_chunk_fki_phenomena_ob_fkey; Type: INDEX; Schema: _timescaledb_internal; Owner: postgres
--

CREATE INDEX _hyper_7_38_chunk_fki_phenomena_ob_fkey ON _timescaledb_internal._hyper_7_38_chunk USING btree (phenomena_id);


--
-- Name: _hyper_7_38_chunk_fki_ref_sys_fkey; Type: INDEX; Schema: _timescaledb_internal; Owner: postgres
--

CREATE INDEX _hyper_7_38_chunk_fki_ref_sys_fkey ON _timescaledb_internal._hyper_7_38_chunk USING btree (ref_sys_id);


--
-- Name: _hyper_7_38_chunk_fki_sensor_ob_fkey; Type: INDEX; Schema: _timescaledb_internal; Owner: postgres
--

CREATE INDEX _hyper_7_38_chunk_fki_sensor_ob_fkey ON _timescaledb_internal._hyper_7_38_chunk USING btree (sensor_id);


--
-- Name: fki_phenomena_ob_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_phenomena_ob_fkey ON public.observations USING btree (phenomena_id);


--
-- Name: fki_phenomenon_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_phenomenon_fkey ON public.sensors USING btree (phenomena_id);


--
-- Name: fki_ref_sys_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_ref_sys_fkey ON public.observations USING btree (ref_sys_id);


--
-- Name: fki_sensor_ob_fkey; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_sensor_ob_fkey ON public.observations USING btree (sensor_id);


--
-- Name: _hyper_7_38_chunk set_my_point; Type: TRIGGER; Schema: _timescaledb_internal; Owner: postgres
--

CREATE TRIGGER set_my_point BEFORE INSERT ON _timescaledb_internal._hyper_7_38_chunk FOR EACH ROW EXECUTE PROCEDURE public.my_new_point();


--
-- Name: observations set_my_point; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_my_point BEFORE INSERT ON public.observations FOR EACH ROW EXECUTE PROCEDURE public.my_new_point();


--
-- Name: observations ts_insert_blocker; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER ts_insert_blocker BEFORE INSERT ON public.observations FOR EACH ROW EXECUTE PROCEDURE _timescaledb_internal.insert_blocker();


--
-- Name: _hyper_7_38_chunk 38_150_phenomena_ob_fkey; Type: FK CONSTRAINT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_7_38_chunk
    ADD CONSTRAINT "38_150_phenomena_ob_fkey" FOREIGN KEY (phenomena_id) REFERENCES public.phenomenons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _hyper_7_38_chunk 38_151_ref_sys_fkey; Type: FK CONSTRAINT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_7_38_chunk
    ADD CONSTRAINT "38_151_ref_sys_fkey" FOREIGN KEY (ref_sys_id) REFERENCES public.spatial_ref_sys(srid);


--
-- Name: _hyper_7_38_chunk 38_152_sensor_ob_fkey; Type: FK CONSTRAINT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_7_38_chunk
    ADD CONSTRAINT "38_152_sensor_ob_fkey" FOREIGN KEY (sensor_id) REFERENCES public.sensors(sensor_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: observations phenomena_ob_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT phenomena_ob_fkey FOREIGN KEY (phenomena_id) REFERENCES public.phenomenons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sensors phenomenon_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT phenomenon_fkey FOREIGN KEY (phenomena_id) REFERENCES public.phenomenons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: observations ref_sys_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT ref_sys_fkey FOREIGN KEY (ref_sys_id) REFERENCES public.spatial_ref_sys(srid);


--
-- Name: observations sensor_ob_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT sensor_ob_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(sensor_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

