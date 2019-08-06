import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Thing } from "../../models/thing/thing";
import { ThingService } from "../../services/thing/thing.service";
import { HttpErrorResponse } from "@angular/common/http";
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete-confirmation-dialog.component";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-edit-thing",
  templateUrl: "./edit-thing.component.html",
  styleUrls: ["./edit-thing.component.scss"]
})
export class EditThingComponent implements OnInit {
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;
  oof: boolean = false;
  reallyDelete: boolean = false;

  inventoryId: number;
  thingNumber: number;

  thing: Thing;

  form: FormGroup;

  constructor(
    private ts: ThingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder
    ) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getIds();
    this.getThing().then(() => {
      this.form.patchValue(this.thing);
    });
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  private copyData(): void {
    this.thing = this.form.value;
    this.thing.number = this.thingNumber;
  }

  getIds(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
    this.thingNumber = this.route.snapshot.params["thingNumber"];
  }

  async getThing(): Promise<void> {
    try {
      this.thing = await this.ts.getThing(this.inventoryId, this.thingNumber);
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
        console.log("Unknown error in edit-thing while getting thing");
      }
    }
  }

  onEditThing(): void {
    this.editThing().then(() => {
      if (!this.oof) {
        this.router.navigate(["stocks"], { relativeTo: this.route });
      }
    });
  }

  async editThing(): Promise<void> {
    try {
      this.copyData();
      await this.ts.updateThing(this.thing, this.inventoryId);
      this.oof = false;
    } catch (error) {
      this.oof = true;
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
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

  onDeleteThing(): void {
    this.deleteThing().then(() => {
      if (this.reallyDelete) {
        this.router.navigate(["inventories", this.inventoryId, "things"]);
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
          this.inventoryId
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

// Interface
export interface DialogData {
  thing: Thing;
}
