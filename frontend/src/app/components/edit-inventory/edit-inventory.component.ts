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
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-edit-inventory",
  templateUrl: "./edit-inventory.component.html",
  styleUrls: ["./edit-inventory.component.scss"]
})
export class EditInventoryComponent implements OnInit {
  constructor(
    private is: InventoryService,
    private as: AuthService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
    this.formGroup.patchValue({ inventoryName: this.inventory.name });
  }

  // Lading & auth flags
  unauthorized = false;
  notFound = false;
  loading = false;
  oof = false;

  // Operation flags
  reallyDelete = false;
  userNotFound = false;

  // Chip flags
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = false;

  /**
   * The keys which should separate the input values
   */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  /**
   * The imported inventory
   *
   * // TODO revisit
   */
  inventory: Inventory = {} as Inventory;

  /**
   * The owner of the inventory
   */
  owner: User;

  /**
   * The users allowed to make changes to the inventory itself
   */
  admins: User[];

  /**
   * The users allowed to make changes to the inventories contents
   */
  writables: User[];

  /**
   * The users allowed to read data from the inventory
   */
  readables: User[];

  /**
   * The intersection flag signals to the isValid method if the lists
   * have intersections within.
   *
   * A user may only either be owner, admin, writable or readable at once.
   *
   * This flag is true when there is intersection between those roles.
   */
  private intersectionFlag = true;

  /**
   * The formGroup of EditInventoryComponent
   */
  formGroup: FormGroup;

  ngOnInit(): void {
    this.initIt().then(() => {
      console.log(this.owner);
      console.log(this.admins);
      console.log(this.writables);
      console.log(this.readables);
    });
  }

  async initIt(): Promise<void> {
    await this.is.ready;
    console.log(
      "Get inventory from InventoryService: " +
        this.route.snapshot.params.inventoryUuid
    );
    this.inventory = this.is.inventories[
      this.route.snapshot.params.inventoryUuid
    ];
    console.log(this.inventory);

    // Owner
    this.owner = await this.as.getUserByUuid(this.inventory.ownerUuid);

    // Admins
    for (const uuid of this.inventory.adminUuids) {
      this.admins.push(await this.as.getUserByUuid(uuid));
    }

    // Writables
    for (const uuid of this.inventory.writableUuids) {
      this.writables.push(await this.as.getUserByUuid(uuid));
    }

    // Readables
    for (const uuid of this.inventory.readableUuids) {
      this.readables.push(await this.as.getUserByUuid(uuid));
    }
  }

  /**
   * Initiates the formGroup
   */
  createForm(): void {
    this.formGroup = this.fb.group({
      inventoryName: ["", [Validators.required]],
      ownerEmail: ["", [Validators.email]],
      adminEmail: ["", [Validators.email]],
      writableEmail: ["", [Validators.email]],
      readableEmail: ["", [Validators.email]]
    });
  }

  /**
   * Generate an error message for when the email field is invalid
   */
  getErrorMessage(): string {
    return this.formGroup.controls.inventoryName.hasError("required")
      ? "You must enter a value"
      : "";
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    this.updateInventory().then(() => {
      if (!this.oof) {
        this.router.navigate(["things"], { relativeTo: this.route });
      }
    });
  }

  /**
   * Uses the InventoryService to update the inventory
   */
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

  /**
   * Handles a matChipInputTokenEnd event
   *
   * @param event The event emitted by the template
   */
  onAddOwner(event: MatChipInputEvent): void {
    this.addOwner(event).then();
  }

  /**
   * Implements the logic required to separate the input-text into chips
   *
   * @param event The event emitted by the template
   */
  async addOwner(event: MatChipInputEvent): Promise<void> {
    /**
     * The HTML input element the event was emitted from
     */
    const input: HTMLInputElement = event.input;

    /**
     * The value of the field when the event was emitted
     */
    const value: string = event.value;

    // TODO revisit; maybe remove `if`
    if ((value || "").trim()) {
      /**
       * The user to be appended to a list
       */
      let user: User;
      try {
        // Try to resolve the email address received as input
        user = await this.as.getUserByUuid(value.trim());
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
        user = await this.as.getUserByUuid(value.trim());
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

  // writable
  async addWritable(event: MatChipInputEvent): Promise<void> {
    const input: HTMLInputElement = event.input;
    const value: string = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      let user: User;
      try {
        user = await this.as.getUserByUuid(value.trim());
        this.inventory.writableUuids.push(user.uuid);
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

  removeWritable(writable: User): void {
    const index: number = this.inventory.writableUuids.indexOf(writable.uuid);

    if (index >= 0) {
      this.inventory.writableUuids.splice(index, 1);
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
        user = await this.as.getUserByUuid(value.trim());
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

  /**
   * A quick-to-compute method returning the state of the forms validity
   *
   * Checks for the validity of the inventory name, that an owner exists and
   * that the input is free of intersection(s).
   *
   * Used to check if the submit button is to be enabled.
   *
   * @returns true, if the forms state is valid
   */
  isValid(): boolean {
    return (
      // Check if the inventory name is valid
      this.formGroup.valid &&
      // Check, if the owner is null
      this.owner != null &&
      // Check for user intersection
      !this.intersectionFlag
    );
  }
}
