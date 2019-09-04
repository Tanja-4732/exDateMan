CREATE TABLE edm_dev.events (--
 date timestamp(4) with time zone NOT NULL, --
 stream_id uuid NOT NULL, --
 data jsonb NOT NULL, --
CONSTRAINT events_pkey PRIMARY KEY (date, stream_id))--
 WITH (OIDS = FALSE)--
TABLESPACE pg_default;


ALTER TABLE edm_dev.events OWNER to edm;

