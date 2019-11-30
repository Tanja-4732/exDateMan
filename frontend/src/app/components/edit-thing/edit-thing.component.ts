import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Thing } from "../../models/thing/thing";
import { ThingService } from "../../services/thing/thing.service";
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { InventoryService } from "../../services/inventory/inventory.service";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-edit-thing",
  templateUrl: "./edit-thing.component.html",
  styleUrls: ["./edit-thing.component.scss"]
})
export class EditThingComponent implements OnInit {
  unauthorized = false;
  notFound = false;
  loading = true;
  oof = false;
  reallyDelete = false;

  inventoryUuid: string;
  thingUuid: string;

  thing: Thing;

  form: FormGroup;

  constructor(
    private is: InventoryService,
    private ts: ThingService,

    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  async ngOnInit(): Promise<void> {
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;
    this.thingUuid = this.route.snapshot.params.thingUuid;

    await this.is.ready;
    await this.ts.ready;

    this.thing = this.ts.things[this.inventoryUuid].find(
      thing => thing.uuid === this.thingUuid
    );

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: this.is.inventories[this.inventoryUuid].name,
        routerLink: `/inventories`
      },
      {
        icon: Icon.Thing,
        title: "Things",
        routerLink: `/inventories/${this.inventoryUuid}/things`
      },
      {
        title: this.ts.things[this.inventoryUuid].find(
          thing => thing.uuid === this.thingUuid
        ).name
      }
    ];

    this.loading = false;

    this.form.patchValue(this.thing);
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]]
    });
  }

  private copyData(): void {
    this.thing.name = this.form.value.name;
    this.thing.uuid = this.thingUuid;
  }

  getUuids(): void {
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;
    this.thingUuid = this.route.snapshot.params.thingUuid;
  }

  async getThing(): Promise<void> {
    await this.ts.ready;
    this.thing = this.ts.things[this.inventoryUuid].find(
      value => value.uuid === this.thingUuid
    );
    this.loading = false;
  }

  async onEditThing(): Promise<void> {
    await this.editThing();
    if (!this.oof) {
      this.router.navigate([`/inventories/${this.inventoryUuid}/things`]);
    }
  }

  async editThing(): Promise<void> {
    this.copyData();
    await this.ts.updateThing(this.thing, this.inventoryUuid);
    this.oof = false;
  }

  onDeleteThing(): void {
    this.deleteThing().then(() => {
      if (this.reallyDelete) {
        this.router.navigate(["inventories", this.inventoryUuid, "things"]);
      }
    });
  }

  async deleteThing(): Promise<void> {
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      DeleteConfirmationDialogComponent,
      {
        data: { thing: this.thing }
      }
    );

    this.reallyDelete = await dialogRef.afterClosed().toPromise();

    if (this.reallyDelete) {
      try {
        const res: unknown = await this.ts.removeThing(
          this.thing,
          this.inventoryUuid
        );
      } catch (error) {
        // Catch sending-to-the-server errors
        this.oof = true;

        console.log("Unknown error in add-stock while creating");
        console.error(error);
      }
    }
  }
}

// Interface
export interface DialogData {
  thing: Thing;
}
