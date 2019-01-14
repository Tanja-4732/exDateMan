// import * as mongoose from "mongoose";
import { Schema } from "mongoose";

export const ThingSchema: Schema = new Schema({
  thingId: {
    type: Number,
    required: "Enter a thing ID"
  },
  thingName: {
    type: String,
    required: "Enter a thing name"
  },
  thingCategory: {
    type: String
  }
});
