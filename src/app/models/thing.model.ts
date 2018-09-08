import { STOCK } from "./stock.model";
export class THING {
  static things: THING[] = [];
  stocks: STOCK[] = [];

  constructor(public name: string, public category: string) {
    if (name.length === 0) {
      throw Error("No name given");
    }
    THING.things.forEach(thing => {
      if (thing.name === name) {
        throw Error("Already added");
      }
    });
  }
}
