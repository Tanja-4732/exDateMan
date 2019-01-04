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
  constructor(private readonly rootPath: string) {}

  /**
   * Sets the routes
   *
   * @param {Application} app The app object
   * @memberof Routes
   */
  public routes(app: Application): void {
    log("Routes.ts: this.rootPath=" + this.rootPath);
    // The default path; return index.html
    app.route("/").get((req: Request, res: Response) => {
      res
        .status(200)
        .sendFile(path.join(this.rootPath, "./dist/exDateMan/index.html"));
    });

    // Contact
    app
      .route("/contact")
      // GET endpoint
      .get((req: Request, res: Response) => {
        // Get all contacts
        res.status(200).send({
          message: "GET request successful"
        });
      })
      // POST endpoint
      .post((req: Request, res: Response) => {
        // Create new contact
        res.status(200).send({
          message: "POST request successful"
        });
      });

    // Contact detail
    app
      .route("/contact/:contactId")
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
  }
}
