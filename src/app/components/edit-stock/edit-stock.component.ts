import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Stock } from "../../models/stock/stock";
import { StockService } from "../../services/stock/stock.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-edit-stock",
  templateUrl: "./edit-stock.component.html",
  styleUrls: ["./edit-stock.component.scss"]
})
export class EditStockComponent implements OnInit {
  unauthorized: boolean = false;
  notFound: boolean = false;
  loading: boolean = true;
  oof: boolean = false;

  inventoryId: number;
  thingNumber: number;
  stockNumber: number;

  stock: Stock;

  constructor(
    private ss: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getIds();
    this.getStock().then();
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  onEditStock(): void {
    this.editStock().then(() => {
      if (this.oof === false) {
        this.router.navigate([".."], { relativeTo: this.route });
      }
    });
  }

  async editStock(): Promise<void> {
    try {
      await this.ss.updateStock(this.stock, this.inventoryId, this.thingNumber);
      this.oof = false;
    } catch (error) {
      this.oof = true;
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

  getIds(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
    this.thingNumber = this.route.snapshot.params["thingNumber"];
    this.stockNumber = this.route.snapshot.params["stockNumber"];
  }

  async getStock(): Promise<void> {
    try {
      this.stock = await this.ss.getStock(
        this.inventoryId,
        this.thingNumber,
        this.stockNumber
      );
      this.loading = false;
    } catch (error) {
      this.oof = true;
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
        console.log("Unknown error in edit-stock while getting stock");
      }
    }
  }
}
