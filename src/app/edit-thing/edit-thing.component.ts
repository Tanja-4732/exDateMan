import { THING } from "./../models/thing.model";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { RestService } from "../services/Rest/rest.service";

// Interface
export interface DialogData {
  thing: THING;
}

@Component({
  selector: "app-edit-thing",
  templateUrl: "./edit-thing.component.html",
  styleUrls: ["./edit-thing.component.scss"]
})
export class EditThingComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    public dialog: MatDialog,
    private rest: RestService
  ) {}

  stopOperation = false;
  nameUnavailable = false;
  thingName: string;
  thingCategory: string;
  thing: THING;
  unavailableName: string;
  reallyDelete = false;

  ngOnInit() {
    this.getThing();
  }

  getThing() {
    this.thingName = this.router.snapshot.params["thingName"];
    try {
      this.thing = THING.getThingByName(this.thingName);
      this.thingCategory = this.thing.category;
    } catch (e) {
      this.stopOperation = true;
    }
  }

  onEditThing() {
    if (this.thingName === this.thing.name) {
      this.thing.category = this.thingCategory;
    } else {
      if (this.thing.tryChangeName(this.thingName)) {
        this.thing.category = this.thingCategory;
      } else {
        this.nameUnavailable = true;
        this.unavailableName = this.thingName;
        return;
      }
    }
    this.rest.updateThing(this.thing).subscribe(response => {
      console.log(response);
    });
  }

  onDeleteThing() {
    this.reallyDelete = false;

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      // height: "400px",
      // width: "600px",
      data: { thing: this.thing }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.thing.deleteThingByName(this.thingName);
      }
    });
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
