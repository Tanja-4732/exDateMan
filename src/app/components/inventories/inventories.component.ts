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
  loading: boolean = true;

  constructor(private inv: InventoryService) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  onAddInventory(): void {}

  async loadInventories(): Promise<void> {
    this.inv.getInventories().then((inventories: Inventory[]) => {
      this.inventories = inventories;
      this.loading = false;
    });
  }
}
