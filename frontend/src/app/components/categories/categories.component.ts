import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category/category.service";

import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";
import { Inventory } from "src/app/models/inventory/inventory";
import { InventoryService } from "src/app/services/inventory/inventory.service";
import { v4 } from "uuid";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {
  constructor(
    private cs: CategoryService,
    private is: InventoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  name: string;
  inventoryUuid: string;
  inventory: Inventory;

  async ngOnInit() {
    // Get Inventory UUID
    this.inventoryUuid = this.route.snapshot.params.inventoryUuid;

    await this.is.ready;
    this.inventory = this.is.inventories[this.inventoryUuid];

    CrumbTrailComponent.crumbs = [
      {
        icon: Icon.Inventory,
        title: this.inventory.name,
        routerLink: `/inventories`
      },
      {
        icon: Icon.Category,
        title: "Categories"
      }
    ];

    await this.cs.ready;

    // TODO remove this log
    console.log(JSON.stringify(this.cs.categories));

    const randomness = Math.random() * 1000;

    // await this.cs.createCategory("rand_" + randomness, "", this.inventoryUuid);

    await this.cs.createCategory(
      "child_" + randomness,
      "f7526905-b05c-489a-935e-dc80a2bd2b75",
      this.inventoryUuid
    );
  }
}
