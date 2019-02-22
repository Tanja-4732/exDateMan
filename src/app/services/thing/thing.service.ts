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

  async getThings(inventoryId: number): Promise<Thing[]> {
    return await this.http
      .get<Thing[]>(this.baseUrl + "/inv/" + inventoryId + "/things")
      .toPromise();
  }
}
