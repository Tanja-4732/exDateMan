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

  constructor(private is: InventoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  async loadInventories(): Promise<void> {
    console.log("Loading...");

    try {
      await this.is.ready;
      console.log(this.is.inventories);

      this.inventories = Object.keys(this.is.inventories).map(
        (key: string) => this.is.inventories[key]
      );
      this.loading = false;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Set flag for html change and timeout above
          this.unauthorized = true;
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 3000);
        } else {
          console.log("Unknown error in inventories while fetching");
        }
      }
    }
  }
}
