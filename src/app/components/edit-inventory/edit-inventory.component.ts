import { Component, OnInit } from "@angular/core";
import { Inventory } from "../../models/inventory/inventory";
import { InventoryService } from "../../services/inventory/inventory.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { MatDialog, MatDialogRef, MatChipInputEvent } from "@angular/material";
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { User } from "../../models/user/user";
import { UserService } from "../../services/user/user.service";
import { InventoryUserAccess } from "../../models/inventory-user-access.enum";
import { InventoryUser } from "../../models/inventory-user/inventory-user";

export interface Fruit {
  name: string;
}

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
  userNotFound: boolean = false;

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  owner: User;
  admins: User[] = [];
  writeables: User[] = [];
  readables: User[] = [];

  inventory: Inventory = new Inventory();

  constructor(
    private is: InventoryService,
    private us: UserService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inventory.id = this.route.snapshot.params["inventoryId"];
    this.getInventory().then(() => {
      this.mapUsers();
    });
  }

  /**
   * Map the inventories users to the local arrays
   *
   * @memberof EditInventoryComponent
   */
  mapUsers(): void {
    for (const inventoryUser of this.inventory.inventoryUsers) {
      switch (inventoryUser.InventoryUserAccessRights) {
        case InventoryUserAccess.OWNER:
          this.owner = inventoryUser.user;
          break;
        case InventoryUserAccess.ADMIN:
          this.admins.push(inventoryUser.user);
          break;
        case InventoryUserAccess.WRITE:
          this.writeables.push(inventoryUser.user);
          break;
        case InventoryUserAccess.READ:
          this.readables.push(inventoryUser.user);
          break;
        default:
          throw new Error("mapUsers fallThrough error");
      }
    }
  }

  /**
   * Write the users from the local arrays to the inventory
   *
   * @memberof EditInventoryComponent
   */
  reverseMapUsers(): void {
    const inventoryUsers: InventoryUser[] = [];

    inventoryUsers.push({
      user: this.owner,
      InventoryUserAccessRights: InventoryUserAccess.OWNER
    });

    for (const admin of this.admins) {
      inventoryUsers.push({
        user: admin,
        InventoryUserAccessRights: InventoryUserAccess.ADMIN
      });
    }

    for (const writeable of this.writeables) {
      inventoryUsers.push({
        user: writeable,
        InventoryUserAccessRights: InventoryUserAccess.WRITE
      });
    }

    for (const readable of this.readables) {
      inventoryUsers.push({
        user: readable,
        InventoryUserAccessRights: InventoryUserAccess.READ
      });
    }

    this.inventory.inventoryUsers = inventoryUsers;
  }

  async getInventory(): Promise<void> {
    try {
      this.inventory = await this.is.getInventory(this.inventory.id);

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
      this.reverseMapUsers();
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

  //
  // Chips logic
  //

  // admin
  async addAdmin(event: MatChipInputEvent): Promise<void> {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    // Add the admin
    if ((value || "").trim()) {
      let user: User;
      try {
        user = await this.us.getUser(value.trim());
        this.admins.push(user);
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
    const index: number = this.admins.indexOf(admin);

    if (index >= 0) {
      this.admins.splice(index, 1);
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
        this.writeables.push(user);
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
    const index: number = this.writeables.indexOf(writeable);

    if (index >= 0) {
      this.writeables.splice(index, 1);
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
        this.readables.push(user);
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
    const index: number = this.readables.indexOf(readable);

    if (index >= 0) {
      this.readables.splice(index, 1);
    }
  }
}
