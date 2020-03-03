import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "src/app/services/category/category.service";

import { FlatTreeControl, NestedTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNestedDataSource
} from "@angular/material/tree";
import {
  CrumbTrailComponent,
  Icon
} from "../crumb-trail/crumb-trail.component";
import { Inventory } from "src/app/models/inventory/inventory";
import { InventoryService } from "src/app/services/inventory/inventory.service";
import { v4 } from "uuid";
import { Category } from "src/app/models/category/category";
import { MatDialog } from "@angular/material/dialog";
import { CreateCategoryComponent } from "../create-category/create-category.component";
import { EditCategoryComponent } from "../edit-category/edit-category.component";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit {
  treeControl = new NestedTreeControl<Category>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Category>();

  constructor(
    private cs: CategoryService,
    private is: InventoryService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  name: string;
  inventoryUuid: string;
  inventory: Inventory;

  hasChild = (_: number, node: Category) =>
    !!node.children && node.children.length > 0;

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

    this.setData();
  }

  private setData() {
    // Reset the data (workaround for an angular bug)
    this.dataSource.data = null;

    // Set the data of the data source to the categories projection
    this.dataSource.data = this.cs.categories[this.inventoryUuid];
  }

  public async createCategory() {
    await this.cs.ready;
    // TODO remove this log
    const randomness = Math.random() * 1000;
    await this.cs.createCategory(
      "child_" + randomness,
      "root",
      this.inventoryUuid
    );

    this.setData();
  }

  public logCategories() {
    console.log("This is the categoriesComponent");
    console.log(JSON.stringify(this.cs.categories));
  }

  openCreateDialog(node?: Category): void {
    // When creating a new root category ...
    if (node === null) {
      // ... provide a dummy-parent
      node = { createdOn: null, uuid: "root", name: "root-category" };
    }

    console.log(node);

    const dialogRef = this.dialog.open(CreateCategoryComponent, {
      // width: "250px",
      data: node
    });

    dialogRef.afterClosed().subscribe(async result => {
      // Only create a category when a name was provided
      if (result !== undefined) {
        console.log(result);

        await this.cs.ready;
        await this.cs.createCategory(result, node.uuid, this.inventoryUuid);
        this.setData();
      }
    });
  }

  openEditDialog(node: Category): void {
    console.log(node);

    const dialogRef = this.dialog.open(EditCategoryComponent, {
      // width: "250px",
      data: node
    });

    dialogRef.afterClosed().subscribe(async result => {
      // Ignore cancel
      if (result !== undefined) {
        console.log(result);

        await this.cs.ready;

        if (result.wantsToDelete) {
          await this.cs.deleteCategory(node, this.inventoryUuid);
        } else {
          node.name = result.childName;
          await this.cs.updateCategory(node, this.inventoryUuid);
        }

        this.setData();
      }
    });
  }
}
