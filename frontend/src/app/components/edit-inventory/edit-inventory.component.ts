import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { User } from "../../models/user/user";
import { UserService } from "../../services/user/user.service";
import { InventoryUserAccess } from "../../models/inventory-user-access.enum";
import { InventoryUser } from "../../models/inventory-user/inventory-user";
import { Validators, FormControl } from "@angular/forms";

export interface Fruit {
  name: string;
}

@Component({
  selector: "app-edit-inventory",
  templateUrl: "./edit-inventory.component.html",
  styleUrls: ["./edit-inventory.component.scss"]
})
export class EditInventoryComponent implements OnInit {
  // Lading & auth flags
  unauthorized = false;
  notFound = false;
  loading = false;
  oof = false;
  reallyDelete = false;
  userNotFound = false;

  // Old flags // TODO revisit
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;

  /**
   * The keys which should separate the input values
   */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  inventory: Inventory = {} as Inventory;

  ownerEmail: FormControl = new FormControl("", [
    Validators.required,
    Validators.email
  ]);

  private owner: User;

  constructor(
    private is: InventoryService,
    private us: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  /**
   * Generate an error message for when the email field is invalid
   */
  getErrorMessage(): string {
    return this.ownerEmail.hasError("required")
      ? "You must enter a value"
      : this.ownerEmail.hasError("email")
      ? "Not a valid email"
      : "";
  }

  ngOnInit(): void {
    console.log(
      "Get inventory from InventoryService: " +
        this.route.snapshot.params.inventoryUuid
    );

    this.inventory = this.is.inventories[
      this.route.snapshot.params.inventoryUuid
    ];
  }

  onEditInventory(): void {
    this.updateInventory().then(() => {
      if (!this.oof) {
        this.router.navigate(["things"], { relativeTo: this.route });
      }
    });
  }

  async updateInventory(): Promise<void> {
    // TODO implement
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

  //
  // Chips logic
  //

  // owner

  onAddOwner(event: MatChipInputEvent): void {
    this.addOwner(event).then();
  }

  async addOwner(event: MatChipInputEvent): Promise<void> {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    // Add the admin
    if ((value || "").trim()) {
      let user: User;
      try {
        user = await this.us.getUser(value.trim());
        this.owner = user;
      } catch (error) {
        this.userNotFound = true;
      }
      this.userNotFound = false;
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeOwner(): void {
    this.owner = null;
  }

  // admin
  async addAdmin(event: MatChipInputEvent): Promise<void> {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    // Add the admin
    if ((value || "").trim()) {
      let user: User;
      try {
        user = await this.us.getUser(value.trim());
        this.inventory.adminUuids.push(user.uuid);
      } catch (error) {
        this.userNotFound = true;
      }
      this.userNotFound = false;
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeAdmin(admin: User): void {
    const index: number = this.inventory.adminUuids.indexOf(admin.uuid);

    if (index >= 0) {
      this.inventory.adminUuids.splice(index, 1);
    }
  }

  // writeable
  async addWriteable(event: MatChipInputEvent): Promise<void> {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      let user: User;
      try {
        user = await this.us.getUser(value.trim());
        this.inventory.writeableUuids.push(user.uuid);
      } catch (error) {
        this.userNotFound = true;
      }
      this.userNotFound = false;
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeWriteable(writeable: User): void {
    const index: number = this.inventory.writeableUuids.indexOf(writeable.uuid);

    if (index >= 0) {
      this.inventory.writeableUuids.splice(index, 1);
    }
  }

  // readable
  async addReadable(event: MatChipInputEvent): Promise<void> {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      let user: User;
      try {
        user = await this.us.getUser(value.trim());
        this.inventory.readableUuids.push(user.uuid);
      } catch (error) {
        this.userNotFound = true;
      }
      this.userNotFound = false;
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  removeReadable(readable: User): void {
    const index: number = this.inventory.readableUuids.indexOf(readable.uuid);

    if (index >= 0) {
      this.inventory.readableUuids.splice(index, 1);
    }
  }
}
