--
--
--
-- Notice:
-- This script isn't always kept up-to-date.
--
--
--
--

-- Get all the things
SELECT * FROM "edm_dev"."thing" order by number LIMIT 1000;

-- Delete all things
DELETE FROM "edm_dev"."thing" where number = 1;
DELETE FROM "edm_dev"."thing" where number = 2;

-- Strategy 1
  SELECT  "number" + 1 AS the_number
      FROM    (SELECT * FROM edm_dev.thing foo
               WHERE foo."inventoryId" = 1
               UNION ALL SELECT 0 AS "number", 
               '' AS "name", 2 AS "inventoryId") foo
      WHERE   NOT EXISTS
              (
              SELECT  NULL
              FROM    edm_dev.thing bar
              WHERE   bar."number" = foo."number" + 1
                AND bar."inventoryId" = 2
                AND foo."inventoryId" = 2
              )
      ORDER BY
              "number"
      LIMIT 1;

-- Strategy 2
SELECT MIN("number"+1) AS THE_NUMBER FROM (
    SELECT 0 AS "number" UNION ALL
    SELECT
        MIN("number"+1)
    FROM
        edm_dev.thing) AS T1
WHERE
    "number"+1 NOT IN (SELECT "number" FROM edm_dev.thing);

--
-- Stock
--

-- Delete all things
DELETE FROM "edm_dev"."stock" where number = 1;
DELETE FROM "edm_dev"."inventory" CASCADE;
DELETE FROM "edm_dev"."inventory_user";

-- Get all the things
SELECT * FROM "edm_dev"."stock" order by number LIMIT 1000;

-- Strategy 1
  SELECT  "number" + 1 AS the_number
      FROM    (SELECT * FROM edm_dev.stock foo 
              WHERE foo."inventoryId" = 2
              AND foo."thingNumber" = 3 UNION ALL
               SELECT 0 AS "number", 1 AS "thingNumber",
               CURRENT_DATE AS "exDate", '' AS "quantity",
               0 AS "useUpIn", 100 AS "percentLeft", 
               1 AS "inventoryId", NULL as "openedOn") foo
      WHERE   NOT EXISTS
              (
              SELECT  NULL
              FROM    edm_dev.stock bar
              WHERE   bar."number" = foo."number" + 1
                AND bar."inventoryId" = 2
                AND foo."inventoryId" = 2

                AND bar."thingNumber" = 3
                AND foo."thingNumber" = 3
              )
      ORDER BY
              "number"
      LIMIT 1;
