import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-add-stock",
  templateUrl: "./add-stock.component.html",
  styleUrls: ["./add-stock.component.scss"]
})
export class AddStockComponent implements OnInit {
  exDate: Date;
  name: string;
  useUpIn: number; // Days
  quantity: string;
  constructor() {}

  ngOnInit() {}
}
