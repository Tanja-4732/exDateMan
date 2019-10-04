import { Component, OnInit } from "@angular/core";
import { Thing } from "../../models/thing/thing";
import { ThingService } from "../../services/thing/thing.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-things",
  templateUrl: "./things.component.html",
  styleUrls: ["./things.component.scss"]
})
export class ThingsComponent implements OnInit {
  unauthorized = false;
  notFound = false;
  loading = true;
  oof = false;

  things: Thing[] = [];
  inventoryUuid: string;

  constructor(
    private ts: ThingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInventoryId();
    this.getThings().then();
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
  }

  async getThings(): Promise<void> {
    try {
      console.log("Getting things");

      this.things = await this.ts.getThings(this.inventoryUuid);
      console.log("Got things");

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
        console.log("Unknown error in add-stock while creating");
      }
    }
  }

  getInventoryId(): void {
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;
  }

  onAddThing(): void {}
}
