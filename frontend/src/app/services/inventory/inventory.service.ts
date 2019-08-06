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
    const response: GetInventoriesResponse = await this.http
      .get<GetInventoriesResponse>(this.baseUrl + "/inv")
      .toPromise();

    // Convert the date strings to dates
    for (const inventory of response.inventories) {
      inventory.createdOn = new Date(
        (inventory.createdOn as unknown) as string
      );
    }
    return response.inventories;
  }

  async newInventory(
    name: string,
    admins?: User[],
    writeables?: User[],
    readables?: User[]
  ): Promise<Inventory> {
    const adminIds: number[] = [];
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
    }

    // Request & Response
    const response: NewInventoryResponse = await this.http
      .post<NewInventoryResponse>(this.baseUrl + "/inv", {
        name,
        admins: adminIds,
        writeables: writeableIds,
        readables: readableIds
      } as NewInventoryRequest)
      .toPromise();

    return response.inventory;
  }

  async getInventory(inventoryId: number): Promise<Inventory> {
    return await this.http
      .get<Inventory>(this.baseUrl + "/inv/" + inventoryId)
      .toPromise();
  }

  async updateInventory(inventory: Inventory): Promise<Inventory> {
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
    }

    const qReq: UpdateInventoryRequest = {
      owner,
      admins,
      readables,
      writeables,
      name: inventory.name
    } as UpdateInventoryRequest;

    const qRes: any = await this.http
      .put<Inventory>(this.baseUrl + "/inv/" + inventory.id, qReq)
      .toPromise();

      return qRes;
  }

  async deleteInventory(inventory: Inventory): Promise<unknown> {
    const qRes: unknown = this.http
      .delete<Inventory>(this.baseUrl + "/inv/" + inventory.id)
      .toPromise();
    return qRes;
  }
}

interface GetInventoriesResponse {
  status: number;
  message: string;
  inventories: Inventory[];
}

interface NewInventoryRequest {
  name: string;
  admins: number[];
  writeables: number[];
  readables: number[];
}

interface NewInventoryResponse {
  message: string;
  inventory: Inventory;
}

interface UpdateInventoryRequest {
  name: string;
  owner?: number;
  admins: number[];
  writeables: number[];
  readables: number[];
}
