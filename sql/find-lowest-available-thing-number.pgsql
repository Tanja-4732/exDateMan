SELECT * FROM "edm_dev"."stock" LIMIT 1000;

 SELECT  "number" + 1 AS "THE_NUMBER"
      FROM    thing mo
      WHERE   NOT EXISTS
              (
              SELECT  NULL
              FROM    thing mi
              WHERE   mi."number" = mo."number" + 1
                AND mi."inventoryId" = $1
                AND mo."inventoryId" = $1
              )
              AND mo."inventoryId" = $1
      ORDER BY
              "number"
      LIMIT 1;
