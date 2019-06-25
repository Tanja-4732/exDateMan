-- Generiert von Oracle SQL Developer Data Modeler 17.4.0.355.2131
--   am/um:        2019-01-13 21:42:23 MEZ
--   Site:      Oracle Database 11g
--   Typ:      Oracle Database 11g



CREATE TABLE category (
    categoryid     CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    categoryname   CLOB NOT NULL
);

ALTER TABLE category ADD CONSTRAINT category_pk PRIMARY KEY ( categoryid );

CREATE TABLE category_thing (
    category_categoryid          CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    thing_thingid                CHAR(10 BYTE) NOT NULL,
    thing_inventoryid            CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    thing_inventoryowneruserid   CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL
);

ALTER TABLE category_thing
    ADD CONSTRAINT category_thing_pk PRIMARY KEY ( category_categoryid,
    thing_thingid,
    thing_inventoryid,
    thing_inventoryowneruserid );

CREATE TABLE inventory (
    inventoryid          CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    inventoryname        CLOB NOT NULL,
    inventorycreatedon   DATE,
    user_userid          CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL
);

ALTER TABLE inventory ADD CONSTRAINT inventory_pk PRIMARY KEY ( inventoryid,
user_userid );

CREATE TABLE inventoryreadpermitteduser (
    user_userid             CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    inventory_inventoryid   CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    inventory_user_userid   CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL
);

ALTER TABLE inventoryreadpermitteduser
    ADD CONSTRAINT inventoryreadpermitteduser_pk PRIMARY KEY ( user_userid,
    inventory_inventoryid,
    inventory_user_userid );

CREATE TABLE inventorywritepermitteduser (
    user_userid             CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    inventory_inventoryid   CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    inventory_user_userid   CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL
);

ALTER TABLE inventorywritepermitteduser
    ADD CONSTRAINT inventorywritepermitteduser_pk PRIMARY KEY ( user_userid,
    inventory_inventoryid,
    inventory_user_userid );

CREATE TABLE stock (
    stockid                                CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    stockno                                INTEGER NOT NULL,
    thing_thingid                          CHAR(10 BYTE) NOT NULL,
    stockaddedon                           DATE NOT NULL,
    stockexdate                            DATE NOT NULL,
    stockquantity                          CLOB,
    stockuseupin                           INTEGER,
    stockpercentleft                       FLOAT(3) NOT NULL,
    thing_inventory_inventoryid            CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL, 
--  ERROR: Column name length exceeds maximum allowed length(30) 
    thing_inventory_inventoryowneruserid   CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL
);

ALTER TABLE stock
    ADD CONSTRAINT stock_pk PRIMARY KEY ( thing_thingid,
    thing_inventory_inventoryid,
    thing_inventory_inventoryowneruserid,
    stockid );

CREATE TABLE thing (
    thingid                          CHAR(10 BYTE) NOT NULL,
    thingname                        CLOB NOT NULL,
    inventory_inventoryid            CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    inventory_inventoryowneruserid   CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL
);

ALTER TABLE thing
    ADD CONSTRAINT thing_pk PRIMARY KEY ( thingid,
    inventory_inventoryid,
    inventory_inventoryowneruserid );

CREATE TABLE "User" (
    userid              CHAR 
--  WARNING: CHAR size not specified 
     NOT NULL,
    username            CLOB NOT NULL,
    useremail           CLOB NOT NULL,
    userpwdsaltedhash   CLOB NOT NULL,
    userpwdhashsalt     CLOB NOT NULL,
    usercreatedon       DATE NOT NULL
);

ALTER TABLE "User" ADD CONSTRAINT user_pk PRIMARY KEY ( userid );

ALTER TABLE category_thing
    ADD CONSTRAINT category_thing_category_fk FOREIGN KEY ( category_categoryid )
        REFERENCES category ( categoryid );

ALTER TABLE category_thing
    ADD CONSTRAINT category_thing_thing_fk FOREIGN KEY ( thing_thingid,
    thing_inventoryid,
    thing_inventoryowneruserid )
        REFERENCES thing ( thingid,
        inventory_inventoryid,
        inventory_inventoryowneruserid );

ALTER TABLE inventory
    ADD CONSTRAINT inventory_user_fk FOREIGN KEY ( user_userid )
        REFERENCES "User" ( userid );

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE inventoryreadpermitteduser
    ADD CONSTRAINT inventoryreadpermitteduser_inventory_fk FOREIGN KEY ( inventory_inventoryid,
    inventory_user_userid )
        REFERENCES inventory ( inventoryid,
        user_userid );

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE inventoryreadpermitteduser
    ADD CONSTRAINT inventoryreadpermitteduser_user_fk FOREIGN KEY ( user_userid )
        REFERENCES "User" ( userid );

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE inventorywritepermitteduser
    ADD CONSTRAINT inventorywritepermitteduser_inventory_fk FOREIGN KEY ( inventory_inventoryid,
    inventory_user_userid )
        REFERENCES inventory ( inventoryid,
        user_userid );

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE inventorywritepermitteduser
    ADD CONSTRAINT inventorywritepermitteduser_user_fk FOREIGN KEY ( user_userid )
        REFERENCES "User" ( userid );

ALTER TABLE stock
    ADD CONSTRAINT stock_thing_fk FOREIGN KEY ( thing_thingid,
    thing_inventory_inventoryid,
    thing_inventory_inventoryowneruserid )
        REFERENCES thing ( thingid,
        inventory_inventoryid,
        inventory_inventoryowneruserid );

ALTER TABLE thing
    ADD CONSTRAINT thing_inventory_fk FOREIGN KEY ( inventory_inventoryid,
    inventory_inventoryowneruserid )
        REFERENCES inventory ( inventoryid,
        user_userid );



-- Zusammenfassungsbericht für Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                             8
-- CREATE INDEX                             0
-- ALTER TABLE                             17
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   5
-- WARNINGS                                18
