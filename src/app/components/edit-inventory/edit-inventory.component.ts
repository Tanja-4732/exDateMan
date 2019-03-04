import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog, MatDialogRef } from "@angular/material";
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete-confirmation-dialog.component";

@Component({
  selector: "app-edit-inventory",
  templateUrl: "./edit-inventory.component.html",
  styleUrls: ["./edit-inventory.component.scss"]
})
export class EditInventoryComponent implements OnInit {
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;
  oof: boolean = false;
  reallyDelete: boolean = false;

  inventory: Inventory = new Inventory();

  constructor(
    private is: InventoryService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inventory.id = this.route.snapshot.params["inventoryId"];
    this.getInventory().then();
  }

  async getInventory(): Promise<void> {
    try {
      this.inventory = await this.is.getInventory(
        this.inventory.id
      );
      this.loading = false;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            // Set flag for html change and timeout above
            this.unauthorized = true;
            break;
          case 404:
            this.notFound = true;
        }
      } else {
        console.log("Unknown error in inventories while fetching");
      }
    }
  }

  onEditInventory(): void {
    this.updateInventory().then(() => {
      if (!this.oof) {
        this.router.navigate(["things"], { relativeTo: this.route });
      }
    });
  }

  async updateInventory(): Promise<void> {
    try {
      await this.is.updateInventory(this.inventory);
      this.oof = false;
    } catch (error) {
      this.oof = true;
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            // Set flag for html change and timeout above
            this.unauthorized = true;
            break;
          case 404:
            this.notFound = true;
        }
      } else {
        console.log("Unknown error in inventories while updating");
      }
    }
  }

  onDeleteInventory(): void {
    this.deleteInventory().then(() => {
      if (this.reallyDelete) {
        this.router.navigate(["inventories"]);
      }
    });
  }

  async deleteInventory(): Promise<void> {
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      DeleteConfirmationDialogComponent,
      {
        data: { inventory: this.inventory }
      }
    );

    this.reallyDelete = await dialogRef.afterClosed().toPromise();

    if (this.reallyDelete) {
      try {
        const res: unknown = await this.is.deleteInventory(this.inventory);
      } catch (error) {
        // Catch sending-to-the-server errors
        this.oof = true;
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              // Set flag for html change and timeout above
              this.unauthorized = true;
              break;
            case 404:
              this.notFound = true;
          }
        } else {
          console.log("Unknown error in add-stock while creating");
        }
      }
    }
  }
}
