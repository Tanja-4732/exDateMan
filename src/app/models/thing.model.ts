import { RestService } from './../services/Rest/rest.service';
import { STOCK } from "./stock.model";

// TODO delete this file when ready

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
    console.log("reached error while searching for " + thingName);
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

  tryChangeName(thingName: string): boolean {
    try {
      THING.getThingByName(thingName);
    } catch (e) {
      this.name = thingName;
      return true;
    }
    return false;
  }

  deleteStockByID(id: number): any {
    this.stocks.splice(this.getStockIndexById(id), 1);
  }

  private getStockIndexById(id: number) {
    let i = 0;
    for (; i < this.stocks.length; i++) {
      const stock = this.stocks[i];
      if (stock.id === id) {
        return i;
      }
    }
    return -1;
  }

  addStock(stock: STOCK) {
    this.stocks.push(stock);
    this.lastStockId++;
  }

  getStockById(id: number) {
    for (const stock of this.stocks) {
      if (stock.id == id) {
        // TODO maybe change back to === from ==
        return stock;
      }
    }
    throw Error("Stock couldn't be found.");
  }

  getThingIndexByName(thingName: string): number {
    let i: number;
    for (i = 0; i < THING.things.length; i++) {
      if (THING.things[i].name === thingName) {
        return i;
      }
    }
    return -1;
  }

  deleteThingByName(name: string) {
    THING.things.splice(this.getThingIndexByName(name), 1);
  }
}

// TODO Automatic isLeft calculation (took 3 pieces of this stock)
