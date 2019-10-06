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

  async ngOnInit(): Promise<void> {
    // Get Inventory UUID
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;

    // Fetch the things of this inventory
    await this.getThings();

    /*
    // Navigate to the login component 3 seconds after being unauthorized
    setTimeout(() => {
      if (this.unauthorized) {
        this.router.navigate(["/login"]);
      }
    }, 3000);
    */
  }

  async getThings(): Promise<void> {
    try {
      console.log("Getting things");

      this.things = this.ts.things[this.inventoryUuid];
      console.log(this.things);
      console.log(JSON.stringify(this.things));

      console.log("Got things");

      this.loading = false;
    } catch (error) {
      this.oof = true;

      console.log("Unknown error in getThings while creating");
      console.log(error);
    }
  }

  onAddThing(): void {}
}
