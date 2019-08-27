import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Inventory } from "../../models/inventory/inventory";
import { environment } from "../../../environments/environment";
import { User } from "../../models/user/user";
import { InventoryUserAccess } from "../../models/inventory-user-access.enum";

@Injectable({
  providedIn: "root"
})
export class InventoryService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  async getInventories(): Promise<Inventory[]> {
    const response = await this.http
      .get<Inventory[]>(this.baseUrl + "/inventories")
      .toPromise();

    // // Convert the date strings to dates
    // for (const inventory of response.inventories) {
    //   inventory.createdOn = new Date(
    //     (inventory.createdOn as unknown) as string
    //   );
    // }
    return response;
  }

  async newInventory(inventory: Inventory): Promise<Inventory> {
    /* const adminIds: number[] = [];
    const writeableIds: number[] = [];
    const readableIds: number[] = [];

    // Copy ids
    if (admins) {
      for (const admin of admins) {
        adminIds.push(admin.id);
      }
    }

    if (writeables) {
      for (const writable of writeables) {
        writeableIds.push(writable.id);
      }
    }

    if (readables) {
      for (const readable of readables) {
        readableIds.push(readable.id);
      }
    } */

    // Request & Response
    return await this.http
      .post<Inventory>(this.baseUrl + "/inventories", inventory)
      .toPromise();
  }

  async getInventory(inventoryId: number): Promise<Inventory> {
    return await this.http
      .get<Inventory>(this.baseUrl + "/inventories/" + inventoryId)
      .toPromise();
  }

  async updateInventory(inventory: Inventory): Promise<Inventory> {
    // TODO implement access rights #91
    /*
    let owner: number;
    const admins: number[] = [];
    const writeables: number[] = [];
    const readables: number[] = [];

       for (const inventoryUser of inventory.inventoryUsers) {
      switch (inventoryUser.InventoryUserAccessRights) {
        case InventoryUserAccess.OWNER:
          owner = inventoryUser.user.id;
          break;
        case InventoryUserAccess.ADMIN:
          admins.push(inventoryUser.user.id);
          break;
        case InventoryUserAccess.WRITE:
          writeables.push(inventoryUser.user.id);
          break;
        case InventoryUserAccess.READ:
          readables.push(inventoryUser.user.id);
          break;
        default:
          throw new Error("mapUsers fallThrough error");
      }
    } */

    return await this.http
      .put<Inventory>(this.baseUrl + "/inventories/" + inventory.id, inventory)
      .toPromise();
  }

  async deleteInventory(inventory: Inventory): Promise<unknown> {
    const qRes: unknown = this.http
      .delete<Inventory>(this.baseUrl + "/inventories/" + inventory.id)
      .toPromise();
    return qRes;
  }
}
