import { Component, OnInit } from "@angular/core";
import { InventoryService } from "../../services/inventory/inventory.service";
import { Inventory } from "../../models/inventory/inventory";
import { Router } from "@angular/router";

@Component({
  selector: "app-add-inventory",
  templateUrl: "./add-inventory.component.html",
  styleUrls: ["./add-inventory.component.scss"]
})
export class AddInventoryComponent implements OnInit {
  name: string = "";
  oof: boolean = false; // Error flag

  // TODO add support for shared inventories

  constructor(private inv: InventoryService, private router: Router) {}

  ngOnInit(): void {}

  onAdd(): void {
    this.inv
      .newInventory(this.name)
      .then((inventory: Inventory) => {
        this.oof = false;
        this.router.navigate(["/inventories"]);
      })
      .catch((reason: any) => {
        this.oof = true;
      });
  }
}
