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

    // TODO remove the testing code
    this.stocks.push(new STOCK(this, new Date(), "1 kg"));
  }
}

// TODO Automatic isLeft calculation (took 3 pieces of this stock)
