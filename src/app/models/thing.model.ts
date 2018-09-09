import { STOCK } from "./stock.model";
export class THING {
  static things: THING[] = [];
  stocks: STOCK[] = [];
  lastStockId = 0;

  constructor(public name: string, public category: string) {
    if (name.length === 0) {
      throw Error("No name given");
    }
    THING.things.forEach(thing => {
      if (thing.name === name) {
        throw Error("Already added");
      }
    });

    // TODO remove the testing code
    // this.stocks.push(new STOCK(this, new Date(), "1 kg"));
  }

  static getStocksByName(thingName: string): STOCK[] {
    for (const thing of THING.things) {
      if (thing.name === thingName) {
        return thing.stocks;
      }
    }
    console.log("reached error");
    throw Error("Thing couldn't be found.");
  }

  static getThingByName(thingName: string): THING {
    for (const thing of THING.things) {
      if (thing.name === thingName) {
        return thing;
      }
    }
    console.log("reached error");
    throw Error("Thing couldn't be found.");
  }
}

// TODO Automatic isLeft calculation (took 3 pieces of this stock)
