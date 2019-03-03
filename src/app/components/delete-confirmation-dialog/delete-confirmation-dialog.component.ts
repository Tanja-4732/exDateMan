import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-delete-confirmation-dialog",
  templateUrl: "./delete-confirmation-dialog.component.html",
  styleUrls: ["./delete-confirmation-dialog.component.scss"]
})
export class DeleteConfirmationDialogComponent<DialogData> implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent<DialogData>>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}
}
