-- SEQUENCE: edm_dev."Events_streamId_seq"
 -- DROP SEQUENCE edm_dev."Events_streamId_seq";

CREATE SEQUENCE edm_dev."Events_streamId_seq" INCREMENT 1
START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;


ALTER SEQUENCE edm_dev."Events_streamId_seq" OWNER TO yourusername;

-- Table: edm_dev."Events"
 -- DROP TABLE edm_dev."Events";

CREATE TABLE edm_dev."Events" ("occurredAt" timestamp with time zone NOT NULL, --
 "streamId" bigint NOT NULL DEFAULT nextval('edm_dev."Events_streamId_seq"'::regclass),--
 "eventData" jsonb NOT NULL,--
 CONSTRAINT "Events_pkey" PRIMARY KEY ("occurredAt",--
 "streamId")) WITH (OIDS = FALSE) TABLESPACE pg_default;--


ALTER TABLE edm_dev."Events" OWNER to yourusername;

