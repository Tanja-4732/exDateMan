-- Get all the things
SELECT * FROM "edm_dev"."thing" order by number LIMIT 1000;

-- Delete all things
DELETE FROM "edm_dev"."thing" where number = 2;

-- Strategy 1
  SELECT  "number" + 1 AS the_number
      FROM    edm_dev.thing mo
      WHERE   NOT EXISTS
              (
              SELECT  NULL
              FROM    edm_dev.thing mi
              WHERE   mi."number" = mo."number" + 1
                AND mi."inventoryId" = 2
                AND mo."inventoryId" = 2
              )
              -- AND mo."inventoryId" = 1
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
    "number"+1 NOT IN (SELECT "number" FROM edm_dev.thing)
