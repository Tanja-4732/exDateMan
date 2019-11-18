import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, Inject, EventEmitter } from "@angular/core";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";
import { HttpErrorResponse } from "@angular/common/http";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";
import { MatSliderChange } from "@angular/material/slider";
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";
import { InventoryService } from "../../services/inventory/inventory.service";
import { ThingService } from "../../services/thing/thing.service";

@Component({
  selector: "app-edit-stock",
  templateUrl: "./edit-stock.component.html",
  styleUrls: ["./edit-stock.component.scss"]
})
export class EditStockComponent implements OnInit {
  unauthorized = false;
  notFound = false;
  loading = false;
  oof = false;
  reallyDelete = false;

  inventoryUuid: string;
  thingUuid: string;
  stockUuid: string;

  stock: Stock;

  form: FormGroup;

  constructor(
    private is: InventoryService,
    private ts: ThingService,
    private ss: StockService,

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
    this.stockUuid = this.route.snapshot.params.stockUuid;

    await this.is.ready;
    await this.ts.ready;
    await this.ss.ready;

    console.log(this.ss.stocks);

    this.stock = this.ss.stocks[this.inventoryUuid][this.thingUuid].find(
      stock => stock.uuid === this.stockUuid
    );

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: this.is.inventories[this.inventoryUuid].name,
        routerLink: `/inventories`
      },
      {
        icon: Icon.Thing,
        title: this.ts.things[this.inventoryUuid].find(
          thing => thing.uuid === this.thingUuid
        ).name,
        routerLink: `/inventories/${this.inventoryUuid}/things`
      },
      {
        icon: Icon.Stock,
        title: "Stocks",
        routerLink: `/inventories/${this.inventoryUuid}/things/${this.thingUuid}/stocks`
      },
      {
        title: this.stock.exDate + "(" + this.stock.percentLeft + "%)"
      }
    ];

    this.form.patchValue(this.stock);
  }

  createForm(): void {
    this.form = this.fb.group({
      exDate: ["", [Validators.required]],
      useUpIn: [5],
      quantity: ["8 kg"],
      percentLeft: [75]
    });
  }

  onEditStock(): void {
    this.editStock().then(() => {
      if (!this.oof) {
        this.router.navigate([".."], { relativeTo: this.route });
      }
    });
  }

  /**
   * Persist the changes made to the Stock
   */
  async editStock(): Promise<void> {
    try {
      // Copy the data to the new Stock object to be persisted
      this.stock = this.form.value;
      console.log(this.stock);

      this.stock.uuid = this.stockUuid;

      // Confirm that it has been opened for the first time just now.
      if (
        ((this.stock.openedOn as unknown) as number) - 0 ===
          ((new Date(0) as unknown) as number) - 0 &&
        this.stock.percentLeft !== 100
      ) {
        // Set the openedOn date to now
        this.stock.openedOn = new Date();
      }
      // Send changes to the server
      await this.ss.updateStock(this.stock, this.inventoryUuid, this.thingUuid);
      this.oof = false;
    } catch (error) {
      // Catch sending-to-the-server errors
      this.oof = true;
      console.error(error);
    }
  }

  onDeleteStock(): void {
    this.deleteStock().then(() => {
      if (this.reallyDelete) {
        this.router.navigate([".."], { relativeTo: this.route });
      }
    });
  }

  async deleteStock(): Promise<void> {
    const dialogRef: MatDialogRef<any> = this.dialog.open(
      DeleteConfirmationDialogComponent,
      {
        data: { stock: this.stock }
      }
    );

    this.reallyDelete = await dialogRef.afterClosed().toPromise();

    if (this.reallyDelete) {
      try {
        const res: unknown = await this.ss.deleteStock(
          this.stock,
          this.inventoryUuid,
          this.thingUuid
        );
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

  percentMoved(event: any): void {
    let value: number = parseInt(event.target.value, 10);
    // Normalize outstanding values
    value = value < 0 ? 0 : value > 100 ? 100 : value;
    this.form.patchValue(
      { percentLeft: value },
      { onlySelf: false, emitEvent: true }
    );
  }

  sliderMoved(event: any): void {
    this.form.patchValue(
      { percentLeft: event.value },
      { onlySelf: false, emitEvent: true }
    );
  }
}

export interface DialogData {
  stock: Stock;
}
