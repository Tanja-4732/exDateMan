import { STOCK } from './stock.model';
export class THING {
  static things: THING[] = [];
  stocks: STOCK[] = [];
  constructor(public name: string, public category: string) {
    THING.things.forEach(thing => {
      if (thing.name === name) {
        throw Error("Already added");
      }
    });
  }
}
