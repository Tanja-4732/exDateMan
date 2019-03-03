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

  async getStock(
    inventoryId: number,
    thingNumber: number,
    stockNumber: number
  ): Promise<Stock> {
    const qRes: Stock = await this.http
      .get<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks/" +
          stockNumber
      )
      .toPromise();
    if (qRes != null) {
      qRes.openedOn = new Date(qRes.openedOn);
      qRes.exDate = new Date(qRes.exDate);
      qRes.addedOn = new Date(qRes.addedOn);
    }
    return qRes;
  }

  async getStocks(inventoryId: number, thingNumber: number): Promise<Stock[]> {
    if (inventoryId == null || thingNumber == null) {
      throw new Error("Arguments invalid");
    }
    const qRes: Stock[] = await this.http
      .get<Stock[]>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks"
      )
      .toPromise();

    for (const stock of qRes) {
      if (stock.openedOn != null) {
        stock.openedOn = new Date(stock.openedOn);
        stock.exDate = new Date(stock.exDate);
        stock.addedOn = new Date(stock.addedOn);
      }
    }
    return qRes;
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
          "/stocks",
        stock
      )
      .toPromise();
  }

  async updateStock(
    stock: Stock,
    inventoryId: number,
    thingNumber: number
  ): Promise<Stock> {
    return await this.http
      .put<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks/" +
          stock.number,
        stock
      )
      .toPromise();
  }

  async deleteStock(
    stock: Stock,
    inventoryId: number,
    thingNumber: number
  ): Promise<unknown> {
    const qRes: unknown = this.http
      .delete<Stock>(
        this.baseUrl +
          "/inv/" +
          inventoryId +
          "/things/" +
          thingNumber +
          "/stocks/" +
          stock.number
      )
      .toPromise();
    return qRes;
  }

  calculateExDate(stock: Stock): Date {
    if (stock.useUpIn != null && stock.openedOn) {
      return (new Date().setDate(
        stock.openedOn.getDate() + stock.useUpIn
      ) as unknown) as Date;
    } else {
      return stock.exDate;
    }
  }
}
