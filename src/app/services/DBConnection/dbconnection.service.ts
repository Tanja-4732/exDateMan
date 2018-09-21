import { Injectable } from "@angular/core";
import { STOCK } from "../../models/stock.model";
import { THING } from "../../models/thing.model";

@Injectable({
  providedIn: "root"
})
export class DBConnectionService {
  private _isAuthorized = false;
  constructor() {}

  // Authorization
  set isAuthorized(nothing: boolean) {
    throw Error("Cannot set isAuthorized");
  }

  get isAuthorized(): boolean {
    return this._isAuthorized;
  }

  authorize(userName: string, pwd: string): boolean {
    throw Error("implement");
  }

  // Data
  getStocksOfThing(thing: THING): STOCK[] {
    throw Error("implement");
  }

  getAllThings() {

  }


}
