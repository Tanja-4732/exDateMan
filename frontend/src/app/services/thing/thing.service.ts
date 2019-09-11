import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Thing } from "../../models/thing/thing";

@Injectable({
  providedIn: "root"
})
export class ThingService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  async getThing(inventoryId: number, thingNumber: number): Promise<Thing> {
    return await this.http
      .get<Thing>(
        this.baseUrl + "/inventories/" + inventoryId + "/things/" + thingNumber
      )
      .toPromise();
  }

  async getThings(inventoryUuid: string): Promise<Thing[]> {
    return await this.http
      .get<Thing[]>(this.baseUrl + "/inventories/" + inventoryUuid + "/things")
      .toPromise();
  }

  async newThing(thing: Thing, inventoryId: number): Promise<Thing> {
    const categoryNumbers: number[] = [];

    // if (thing.categories != null) {
    //   for (const category of thing.categories) {
    //     categoryNumbers.push(category.number);
    //   }
    // }

    return await this.http
      .post<Thing>(
        this.baseUrl + "/inventories/" + inventoryId + "/things",
        thing
      )
      .toPromise();
  }

  async updateThing(thing: Thing, inventoryId: number): Promise<Thing> {
    return await this.http
      .put<Thing>(
        this.baseUrl + "/inventories/" + inventoryId + "/things/" + thing.id,
        thing
      )
      .toPromise();
  }

  async removeThing(thing: Thing, inventoryId: number): Promise<unknown> {
    const qRes: unknown = this.http
      .delete<Thing>(
        this.baseUrl + "/inventories/" + inventoryId + "/things/" + thing.id
      )
      .toPromise();
    return qRes;
  }
}
