import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Inventory } from "../../models/inventory";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class InventoryService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  async getInventories(): Promise<Inventory[]> {
    console.log("getting inventories");
    const response: GetInventoriesResponse = await this.http
      .get<GetInventoriesResponse>(this.baseUrl + "/inv")
      .toPromise();

    // Convert the date strings to dates
    for (const inventory of response.inventories) {
      inventory.InventoryCreatedOn = new Date(
        (inventory.InventoryCreatedOn as unknown) as string
      );
    }
    return response.inventories;
  }
}

interface GetInventoriesResponse {
  status: number;
  message: string;
  inventories: Inventory[];
}
