import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-inventories",
  templateUrl: "./inventories.component.html",
  styleUrls: ["./inventories.component.scss"]
})
export class InventoriesComponent implements OnInit {
  inventories: Inventory[] = [];
  loading = true;
  unauthorized = false;

  constructor(private inv: InventoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadInventories().then();
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  onAddInventory(): void {}

  async loadInventories(): Promise<void> {
    try {
      this.inventories = Object.keys(this.inv.inventories).map(
        (key: string) => this.inv.inventories[key]
      );
      this.loading = false;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Set flag for html change and timeout above
          this.unauthorized = true;
        } else {
          console.log("Unknown error in inventories while fetching");
        }
      }
    }
  }
}
