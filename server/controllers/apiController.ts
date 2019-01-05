import { model } from "mongoose";
import { ThingSchema } from "../models/thingModel";
import { Request, Response } from "express";

const Thing = model("Thing", ThingSchema);

export class ThingController {
  public addNewThing(req: Request, res: Response) {
    let newThing = new Thing(req.body);

    newThing.save((err, thing) => {
      if (err) {
        res.send(err);
      }
      res.json(thing);
    });
  }
}
