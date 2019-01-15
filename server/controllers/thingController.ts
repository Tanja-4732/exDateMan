import { model } from "mongoose";
import { ThingSchema } from "../models/mongodb/thingModel";
import { Request, Response } from "express";

const Thing = model("Thing", ThingSchema);

/**
 * Implements the middleware for the API endpoints for express
 *
 * @export
 * @class ThingController
 */
export class ThingController {
  /**
   * Implements the middleware for adding a new thing
   *
   * @param {Request} req The express request
   * @param {Response} res The express response
   * @memberof ThingController
   */
  public addThing(req: Request, res: Response): void {
    let newThing = new Thing(req.body);

    newThing.save((err: any, thing) => {
      if (err) {
        res.send(err);
      }
      res.json(thing);
    });
  }

  public getThing(req: Request, res: Response): void {
    Thing.find({}, (err, contact) => {
      if (err) {
        res.send(err);
      }
      res.json(contact);
    });
  }

  public getContactByID(req: Request, res: Response): void {
    Thing.findById(req.params.thingId, (err, thing) => {
      if (err) {
        res.send(err);
      }
      res.json(thing);
    });
  }

  public updateThing(req: Request, res: Response): void {
    Thing.findOneAndUpdate(
      { _id: req.params.thingId },
      req.body,
      { new: true },
      (err, thing) => {
        if (err) {
          res.send(err);
        }
        res.json(thing);
      }
    );
  }

  public deleteThing(req: Request, res: Response): void {
    Thing.remove({ _id: req.params.thingId }, (err, thing) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Successfully deleted thing!" });
    });
  }
}
