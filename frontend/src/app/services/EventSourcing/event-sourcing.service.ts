import { Injectable } from "@angular/core";
import { InventoryEvent } from "../../models/InventoryEvent/inventory-event";
import { v4 } from "uuid";

@Injectable({
  providedIn: "root"
})
export class EventSourcingService {
  constructor() {
    console.log("Hello there");
    console.log(v4());
  }

  // get a(): number {
  //   return 42;
  // }
  // getEventsOfInventory(inventoryId: number): InventoryEvent {}
}
