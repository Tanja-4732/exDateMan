import { Component, OnInit } from "@angular/core";
import { ThingService } from "../../services/thing/thing.service";
import { Thing } from "../../models/thing/thing";
import { ActivatedRoute, Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { v4 } from "uuid";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";
import { InventoryService } from "../../services/inventory/inventory.service";

@Component({
  selector: "app-add-thing",
  templateUrl: "./add-thing.component.html",
  styleUrls: ["./add-thing.component.scss"]
})
export class AddThingComponent implements OnInit {
  oof = false; // Error flag
  unauthorized = false;

  thing: Thing;
  inventoryUuid: string;

  form: FormGroup;

  constructor(
    private is: InventoryService,
    private ts: ThingService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;

    await this.is.ready;

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: this.is.inventories[this.inventoryUuid].name,
        routerLink: `/inventories`
      },
      {
        icon: Icon.Thing,
        title: "Things",
        routerLink: `/inventories/${this.inventoryUuid}/things`
      },
      {
        title: "New"
      }
    ];
  }

  onAddThing(): void {
    this.createThing().then(() => {
      this.router.navigate([".."], { relativeTo: this.route });
    });
  }

  private copyData(): void {
    this.thing = this.form.value;
  }

  async createThing(): Promise<void> {
    try {
      this.copyData();
      this.thing.categoryUuids = [];
      this.thing.uuid = v4();
      console.log(this.inventoryUuid);
      await this.ts.newThing(this.thing, this.inventoryUuid);
      this.oof = false;
    } catch (err) {
      console.log("oof"); // TODO remove log
      console.log(err);
    }
  }
}
