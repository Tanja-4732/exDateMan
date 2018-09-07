import { THING } from "./thing.model";

export class STOCK {
  addDate = Date.now;
  constructor(
    public thing: THING,
    public exDate: Date,
    public quantity: string,
    public useUpIn = 0,
    public percentLeft = 100.0
  ) {
    thing.stocks.push(this);
  }
}
