import { Component, OnInit, Input } from "@angular/core";
import { Inventory } from "../../models/inventory";

@Component({
  selector: "app-inventory-card",
  templateUrl: "./inventory-card.component.html",
  styleUrls: ["./inventory-card.component.scss"]
})
export class InventoryCardComponent implements OnInit {
  @Input()
  inventory: Inventory;

  constructor() {}
  ngOnInit() {}
}
