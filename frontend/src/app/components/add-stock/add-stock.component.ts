import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { v4 } from "uuid";
import { InventoryService } from "../../services/inventory/inventory.service";
import { ThingService } from "../../services/thing/thing.service";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";

@Component({
  selector: "app-add-stock",
  templateUrl: "./add-stock.component.html",
  styleUrls: ["./add-stock.component.scss"]
})
export class AddStockComponent implements OnInit {
  unauthorized = false;
  notFound = false;
  oof = false;

  inventoryUuid: string;
  thingUuid: string;

  stock = {} as Stock;

  form: FormGroup;

  constructor(
    private is: InventoryService,
    private ts: ThingService,
    private ss: StockService,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      exDate: ["", [Validators.required]],
      quantity: [""],
      useUpIn: []
    });
  }

  async ngOnInit() {
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;
    this.thingUuid = this.route.snapshot.params.thingUuid;

    await this.is.ready;
    await this.ts.ready;

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: this.is.inventories[this.inventoryUuid].name,
        routerLink: `/inventories`
      },
      {
        icon: Icon.Thing,
        title: this.ts.things[this.inventoryUuid].find(
          thing => thing.uuid === this.thingUuid
        ).name,
        routerLink: `/inventories/${this.inventoryUuid}/things`
      },
      {
        icon: Icon.Stock,
        title: "Stocks",
        routerLink: `/inventories/${this.inventoryUuid}/things/${this.thingUuid}/stocks`
      },
      {
        title: "New"
      }
    ];
  }

  getExDateErrorMessage(): string {
    return this.form.value.exDate.hasError("required")
      ? "We need you to enter an expiration date"
      : "";
  }

  getQuantityErrorMessage(): string {
    return this.form.value.quantity.hasError("required")
      ? "We need you to enter a quantity"
      : "";
  }

  /**
   * Handle the form submission
   */
  onAddStock(): void {
    this.createStock().then(() => {
      if (this.oof === false) {
        this.router.navigate([".."], { relativeTo: this.route });
      }
    });
  }

  /**
   * Persist the new Stock
   */
  async createStock(): Promise<void> {
    try {
      this.stock.uuid = v4();
      this.stock.percentLeft = 100;
      this.stock.exDate = this.form.value.exDate;
      this.stock.useUpIn = this.form.value.useUpIn;
      this.stock.quantity = this.form.value.quantity;
      await this.ss.newStock(this.stock, this.inventoryUuid, this.thingUuid);
      this.oof = false;
    } catch (error) {
      this.oof = true;

      console.log("Unknown error in add-stock while creating");
      console.error(error);
    }
  }
}
