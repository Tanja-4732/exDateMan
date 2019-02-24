import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Stock } from "../../models/stock/stock";

@Injectable({
  providedIn: "root"
})
export class StockService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  async getStocks(inventoryId: number, thingNumber: number): Promise<Stock[]> {
    if (inventoryId == null || thingNumber == null) {
      throw new Error("Arguments invalid");
    }
    return await this.http
      .get<Stock[]>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks"
      )
      .toPromise();
  }

  async newStock(
    stock: Stock,
    inventoryId: number,
    thingNumber: number
  ): Promise<Stock> {
    return await this.http
      .post<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks" +
          stock.number,
        stock
      )
      .toPromise();
  }
}
