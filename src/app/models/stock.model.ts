import { THING } from "./thing.model";

export class STOCK {
  static readonly dayInMs = 86400000;

  addDate = new Date();
  id: number;
  openedOn: Date;
  constructor(
    public thing: THING,
    public exDate: Date,
    public quantity: string,
    public useUpIn = 0,
    public _percentLeft = 100.0
  ) {
    this.id = thing.lastStockId + 1;
  }

  getExDate() {
    try {
      const wouldExpire =
        this.openedOn.valueOf() + this.useUpIn * STOCK.dayInMs;
      if (
        this.useUpIn > 0 &&
        this.exDate.valueOf() > wouldExpire &&
        this.percentLeft !== 100
      ) {
        return new Date(wouldExpire);
      }
    } catch (e) {}
    return this.exDate;
  }

  set percentLeft(percentLeft: number) {
    if (percentLeft != 100 && percentLeft != 0) {
      // TODO Change back to !== form !=
      this.openedOn = new Date();
    } else if (percentLeft == 0) {
      this.thing.deleteStockByID(this.id);
    }
    this._percentLeft = percentLeft;
  }

  get percentLeft() {
    return this._percentLeft;
  }
}
