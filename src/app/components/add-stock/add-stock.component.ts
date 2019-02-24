import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-add-stock",
  templateUrl: "./add-stock.component.html",
  styleUrls: ["./add-stock.component.scss"]
})
export class AddStockComponent implements OnInit {
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;
  oof: boolean = false;

  inventoryId: number;
  thingNumber: number;

  stock: Stock = new Stock();

  constructor(
    private ss: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInventoryIdAndThingNumber();
  }

  onAddStock(): void {
    this.createStock(this.stock).then(() => {
      if (this.oof === false) {
        this.router.navigate([".."], { relativeTo: this.route });
      }
    });
  }

  async createStock(stock: Stock): Promise<void> {
    try {
      this.stock.percentLeft = 100;
      await this.ss.newStock(stock, this.inventoryId, this.thingNumber);
      this.oof = false;
    } catch (error) {
      this.oof = true;
      console.log(error); // TODO remove log
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            // Set flag for html change and timeout above
            this.unauthorized = true;
            break;
          case 404:
            this.notFound = true;
        }
      } else {
        console.log("Unknown error in add-stock while creating");
      }
    }
  }

  getInventoryIdAndThingNumber(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
    this.thingNumber = this.route.snapshot.params["thingNumber"];
  }
}
