import { Component } from "@angular/core";
import { InventoryService } from "../../services/inventory/inventory.service";
import { Inventory } from "../../models/inventory/inventory";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-add-inventory",
  templateUrl: "./add-inventory.component.html",
  styleUrls: ["./add-inventory.component.scss"]
})
export class AddInventoryComponent {
  /**
   * Error flag
   */
  oof = false;

  /**
   * The reactive form
   */
  form: FormGroup;

  // TODO add support for shared inventories

  constructor(
    private inv: InventoryService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ""
    });
  }

  /**
   * Handles form submit
   *
   * @param formData The inventory to be added from the form
   */
  async onSubmit(formData: Inventory) {
    try {
      const inventory: Inventory = await this.inv.createInventory(
        formData.name
      );
      this.oof = false;
      this.router.navigate(["/inventories/" + inventory.uuid + "/things"]);
    } catch (err) {
      this.oof = true;
    }
  }
}
