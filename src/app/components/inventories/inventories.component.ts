import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";

@Component({
  selector: "app-inventories",
  templateUrl: "./inventories.component.html",
  styleUrls: ["./inventories.component.scss"]
})
export class InventoriesComponent implements OnInit {
  inventories: Inventory[] = [];

  constructor(private is: InventoryService) {}

  ngOnInit() {}

  onAddInventory() {}
}
