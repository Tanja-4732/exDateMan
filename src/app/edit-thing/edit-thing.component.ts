import { THING } from "./../models/thing.model";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

export interface DialogData {
  reallyDelete: boolean;
}

@Component({
  selector: "app-edit-thing",
  templateUrl: "./edit-thing.component.html",
  styleUrls: ["./edit-thing.component.scss"]
})
export class EditThingComponent implements OnInit {
  constructor(private router: ActivatedRoute, public dialog: MatDialog) {}
  stopOperation = false;
  nameUnavailable = false;
  thingName: string;
  thingCategory: string;
  thing: THING;
  unavailableName: string;

  ngOnInit() {
    this.getThing();
  }

  getThing() {
    this.thingName = this.router.snapshot.params["thingName"];
    try {
      this.thing = THING.getThingByName(this.thingName);
      this.thingCategory = this.thing.category;
    } catch (e) {}
  }

  onEditThing() {
    if (this.thingName === this.thing.name) {
      this.thing.category = this.thingCategory;
      return;
    }
    if (this.thing.tryChangeName(this.thingName)) {
      this.thing.category = this.thingCategory;
    } else {
      this.nameUnavailable = true;
      this.unavailableName = this.thingName;
    }
  }

  onDeleteThing() {
    let reallyDelete: boolean;
    reallyDelete = false;

    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      height: "400px",
      width: "600px",
      // position: "center",
      data: { reallyDelete: reallyDelete }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed.");
      reallyDelete = result;
    });

    if (reallyDelete) {
      this.thing.deleteThingByName(this.thingName);
    }
  }
}

export class DeleteConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
