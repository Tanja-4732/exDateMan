import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RestService } from "../../services/Rest/rest.service";
import { Thing } from "../../models/thing/thing";
import { ThingService } from "../../services/thing/thing.service";
import { HttpErrorResponse } from "@angular/common/http";

// Interface
export interface DialogData {
  thing: Thing;
}

@Component({
  selector: "app-edit-thing",
  templateUrl: "./edit-thing.component.html",
  styleUrls: ["./edit-thing.component.scss"]
})
export class EditThingComponent implements OnInit {
  reallyDelete: boolean = false;
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;
  oof: boolean = false;

  inventoryId: number;
  thingNumber: number;

  thing: Thing;

  constructor(
    private ts: ThingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getIds();
    this.getThing().then();
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  getIds(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
    this.thingNumber = this.route.snapshot.params["thingNumber"];
  }

  async getThing(): Promise<void> {
    try {
      this.thing = await this.ts.getThing(this.inventoryId, this.thingNumber);
      this.loading = false;
    console.log(this. thing);
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
      if (this.oof === false) {
        this.router.navigate([".."], { relativeTo: this.route });
      }
    });
  }

  async editThing(): Promise<void> {
    try {
      await this.ts.updateThing(this.thing, this.inventoryId, this.thingNumber);
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

  // onEditThing(): void {
  //   if (this.thingName === this.thing.name) {
  //     this.thing.category = this.thingCategory;
  //   } else {
  //     if (this.thing.tryChangeName(this.thingName)) {
  //       this.thing.category = this.thingCategory;
  //     } else {
  //       this.nameUnavailable = true;
  //       this.unavailableName = this.thingName;
  //       return;
  //     }
  //   }
  //   this.rest.updateThing(this.thing).subscribe(response => {
  //     console.log(response);
  //   });
  // }

  onDeleteThing(): void {
    //   this.reallyDelete = false;
    //   const dialogRef: MatDialogRef<any> = this.dialog.open(
    //     DeleteConfirmationDialogComponent,
    //     {
    //       // height: "400px",
    //       // width: "600px",
    //       data: { thing: this.thing }
    //     }
    //   );
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.thing.deleteThingByName(this.thingName);
    //     }
    //   });
  }
}

// Dialog implementation
@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html"
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
}
