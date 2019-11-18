CREATE TABLE edm_dev.events (--
 date timestamp(4) with time zone NOT NULL, --
 "inventoryUuid" uuid NOT NULL, --
 data jsonb NOT NULL, --
CONSTRAINT events_pkey PRIMARY KEY (date, "inventoryUuid"))--
 WITH (OIDS = FALSE)--
TABLESPACE pg_default;


ALTER TABLE edm_dev.events OWNER to edm;

