import { log } from "util";

// Set port
const PORT: string = process.env.PORT || 420 + "";
// Set EDM_ROOT_PATH (the root path of the server)
process.env.EDM_ROOT_PATH = __dirname;

log("Starting server...");
import app from "./app";
app.listen(PORT, () => {
  log("Server listening on port " + PORT);
});

/*
https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-2-98c34e3513a2
https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-3-d545b243541e
https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-4-954c8c059cd4
https://itnext.io/building-restful-web-apis-with-node-js-express-mongodb-and-typescript-part-5-a80e5a7f03db
https://github.com/dalenguyen/rest-api-node-typescript/blob/master/lib/routes/crmRoutes.ts

https://www.typescriptlang.org/docs/handbook/basic-types.html
http://docs.sequelizejs.com/
https://medium.freecodecamp.org/a-comparison-of-the-top-orms-for-2018-19c4feeaa5f

https://www.restapitutorial.com/lessons/httpmethods.html
https://mherman.org/blog/designing-a-restful-api-with-node-and-postgres/

https://expressjs.com/en/guide/using-middleware.html

https://github.com/auth0/express-jwt

https://mlab.com/databases


eval $(ssh-agent)
ssh-add
*/
