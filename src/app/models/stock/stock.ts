export class Stock {
  number: number;
  exDate: Date;
  quantity: string;
  useUpIn: number;
  percentLeft: number;
  openedOn: Date;

  getExDate(): Date {
    if (this.useUpIn != null && this.openedOn) {
      return new Date().setDate(this.openedOn.getDate() + this.useUpIn) as unknown as Date;
    } else {
      return this.exDate;
    }
  }
}
