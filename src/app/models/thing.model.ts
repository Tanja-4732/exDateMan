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

  addStock(stock: STOCK) {
    this.stocks.push(stock);
    this.lastStockId++;
  }

  getStockById(id: number) {
    for (const stock of this.stocks) {
      if (stock.id === id) {
        return stock;
      }
    }
    throw Error("Stock couldn't be found.");
  }
}

// TODO Automatic isLeft calculation (took 3 pieces of this stock)
