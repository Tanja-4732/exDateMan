import { Observable } from "rxjs";
import { RestService } from "../../services/Rest/rest.service";
import { Component, OnInit, Input } from "@angular/core";
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
  things: Thing[] = [];
  inventoryId: number;
  unauthorized: boolean = false;
  loading: boolean = true;

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
      this.things = await this.ts.getThings(this.inventoryId);
      this.loading = false;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          // Set flag for html change and timeout above
          this.unauthorized = true;
        } else {
          console.log("Unknown error in inventories while fetching");
        }
      }
    }
  }

  getInventoryId(): void {
    this.inventoryId = this.route.snapshot.params["inventoryId"];
  }

  onAddThing(): void {}
}
