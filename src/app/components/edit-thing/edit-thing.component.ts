import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RestService } from "../../services/Rest/rest.service";
import { Thing } from "../../models/thing/thing";
import { ThingService } from "../../services/thing/thing.service";

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
  oof: boolean = false;
  unauthorized: boolean = false;
  loading: boolean = true;
  notFound: boolean = false; // TODO implement

  unavailableName: string; // TODO re-think this
  thing: Thing;

  constructor(
    private ts: ThingService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.getThing();
  }

  // getThing(): void {
  //   this.thingName = this.router.snapshot.params["thingName"];
  //   try {
  //     this.thing = THING.getThingByName(this.thingName);
  //     this.thingCategory = this.thing.category;
  //   } catch (e) {
  //     this.stopOperation = true;
  //   }
  // }

  onEditThing(): void {
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
  }

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
