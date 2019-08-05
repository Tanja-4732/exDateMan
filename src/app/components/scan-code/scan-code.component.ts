import { Component, OnInit } from "@angular/core";
import BarcodeFormat from "@zxing/library/esm5/core/BarcodeFormat";

@Component({
  selector: "app-scan-code",
  templateUrl: "./scan-code.component.html",
  styleUrls: ["./scan-code.component.scss"]
})
export class ScanCodeComponent implements OnInit {
  allowedFormats: BarcodeFormat[] = [
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E
  ];

  constructor() {}

  ngOnInit() {}

  onScanSuccess(result: string): void {
    alert(JSON.stringify(result));
  }
}
