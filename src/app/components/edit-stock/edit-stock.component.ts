import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, Inject } from "@angular/core";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";
import { HttpErrorResponse } from "@angular/common/http";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-edit-stock",
  templateUrl: "./edit-stock.component.html",
  styleUrls: ["./edit-stock.component.scss"]
})
export class EditStockComponent implements OnInit {
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;
  oof: boolean = false;
  reallyDelete: boolean = false;

  inventoryId: number;
  thingNumber: number;
  stockNumber: number;

  stock: Stock;

  form: FormGroup;

  constructor(
    private ss: StockService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      exDate: ["", [Validators.required]],
      useUpIn: [5],
      quantity: ["8 kg"],
      percentLeft: [75]
    });
  }

  ngOnInit(): void {
    this.getIds();
    this.getStock().then(() => {
      this.form.patchValue(this.stock);
    });
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  onEditStock(): void {
    this.editStock().then(() => {
      if (!this.oof) {
        this.router.navigate([".."], { relativeTo: this.route });
      }
    });
  }

  async editStock(): Promise<void> {
    try {
      this.copyData();
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
      await this.ss.updateStock(this.stock, this.inventoryId, this.thingNumber);
      this.oof = false;
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

  private copyData(): void {
    this.stock = this.form.value;
    this.stock.number = this.stockNumber;
  }

  getIds(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
    this.thingNumber = this.route.snapshot.params["thingNumber"];
    this.stockNumber = this.route.snapshot.params["stockNumber"];
  }

  async getStock(): Promise<void> {
    try {
      this.stock = await this.ss.getStock(
        this.inventoryId,
        this.thingNumber,
        this.stockNumber
      );
      this.loading = false;
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
        console.log("Unknown error in edit-stock while getting stock");
      }
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
          this.inventoryId,
          this.thingNumber
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
}

export interface DialogData {
  stock: Stock;
}
