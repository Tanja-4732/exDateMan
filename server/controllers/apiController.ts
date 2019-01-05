import { model } from "mongoose";
import { ThingSchema } from "server/models/thingModel";
import { Request, Response } from "express";

const Thing = model("Thing", ThingSchema);

export class ThingController {
  public addNewThing(req: Request, res: Response) {
    // TODO continue implementation
  }
}
