import { ThingController } from "../controllers/thingController";
import { Request, Response, Application } from "express";
import { log } from "util";
import * as path from "path";

/**
 * Handles API calls
 *
 * @export
 * @class Routes
 */
export class Routes {
  public thingController: ThingController = new ThingController();

  constructor() {}

  /**
   * Sets the routes for the app
   *
   * @param {Application} app The app object of which to set the routes
   * @memberof Routes
   */
  public routes(app: Application): void {
    log("routes.ts: init");
    // Contact
    app
      .route("/api/v1/thing")

      .get((req: Request, res: Response) => {
        log("routes: all things");
        // Get all things
        res.status(200).send({
          message: "GET all the things"
        });
      })

      // POST endpoint
      .post(this.thingController.addThing);

    // Contact detail
    app
      .route("/api/v1/thing/:contactId")
      // get specific contact
      .get((req: Request, res: Response) => {
        // Get a single contact detail
        res.status(200).send({
          message: "GET request successful!!!!"
        });
      })
      .put((req: Request, res: Response) => {
        // Update a contact
        res.status(200).send({
          message: "PUT request successful!!!!"
        });
      })
      .delete((req: Request, res: Response) => {
        // Delete a contact
        res.status(200).send({
          message: "DELETE request successful!!!!"
        });
      });

    // The default path; return index.html
    app.route("/*").get((req: Request, res: Response) => {
      res
        .status(200)
        .sendFile(
          path.join(process.env.EDM_ROOT_PATH, "./dist/exDateMan/index.html")
        );
    });
  }
}
