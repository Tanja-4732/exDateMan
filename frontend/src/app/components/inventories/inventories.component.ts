import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";
import { Router } from "@angular/router";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-inventories",
  templateUrl: "./inventories.component.html",
  styleUrls: ["./inventories.component.scss"]
})
export class InventoriesComponent implements OnInit {
  inventories: Inventory[] = [];
  loading = true;
  unauthorized = false;

  constructor(
    private is: InventoryService,
    private router: Router,
    private as: AuthService
  ) {}

  private giveUpCounter = 0;

  ngOnInit(): void {
    this.checkLogin();

    this.tryReload();

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: "Inventories"
      }
    ];
  }

  async checkLogin() {
    /**
     * The auth status of the user
     */
    const status = await this.as.getCurrentUser();

    // TODO remove log
    console.log(status);

    // Based on the user being logged in or not, redirect to the login page
    if (!status.authorized) {
      this.router.navigateByUrl("/login");
      return;
    }
  }

  tryReload() {
    this.loadInventories();
    setTimeout(() => {
      // Maybe give up
      if (this.giveUpCounter > 20) {
        // Reset counter
        this.giveUpCounter = 0;

        // Give up
        return;
      }

      // Increment counter
      this.giveUpCounter++;

      // Retry
      this.tryReload();
    }, 100);
  }

  async loadInventories(): Promise<void> {
    try {
      // Wait for InventoryService to be ready
      await this.is.ready;

      this.inventories = Object.keys(this.is.inventories).map(
        (key: string) => this.is.inventories[key]
      );
      this.loading = false;
    } catch (error) {
      console.log("Unknown error in inventories while fetching");
      console.error(error);
    }
  }
}
