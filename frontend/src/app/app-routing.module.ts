import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { EditThingComponent } from "./components/edit-thing/edit-thing.component";
import { EditStockComponent } from "./components/edit-stock/edit-stock.component";
import { AddStockComponent } from "./components/add-stock/add-stock.component";
import { StocksComponent } from "./components/stocks/stocks.component";
import { AddThingComponent } from "./components/add-thing/add-thing.component";
import { ThingsComponent } from "./components/things/things.component";
import { InventoriesComponent } from "./components/inventories/inventories.component";
import { EditInventoryComponent } from "./components/edit-inventory/edit-inventory.component";
import { AddInventoryComponent } from "./components/add-inventory/add-inventory.component";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { AccountComponent } from "./components/account/account.component";
import { ScanCodeComponent } from "./components/scan-code/scan-code.component";
import { EventsComponent } from "./components/events/events.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { AddCategoryComponent } from "./components/add-category/add-category.component";
import { EditCategoryComponent } from "./components/edit-category/edit-category.component";
import { LoginGuard } from "./guards/login.guard";

const routes: Routes = [
  // Default route
  { path: "", redirectTo: "/welcome", pathMatch: "full" },

  // Welcome
  { path: "welcome", component: WelcomeComponent },

  // Auth
  {
    path: "login",
    children: [
      { path: "", component: LoginComponent },
      { path: ":email", component: LoginComponent }
    ]
  },
  {
    path: "register",
    children: [
      { path: "", component: RegisterComponent },
      { path: ":email", component: RegisterComponent }
    ]
  },

  // Account
  { path: "account", component: AccountComponent },

  // Scan
  { path: "scan", component: ScanCodeComponent },

  // Events
  { path: "events", component: EventsComponent },

  // Inventories
  {
    path: "inventories",
    // canActivate: [LoginGuard],
    // canActivateChild: [LoginGuard],
    children: [
      { path: "", component: InventoriesComponent },
      { path: "new", component: AddInventoryComponent },
      {
        path: ":inventoryUuid",
        children: [
          { path: "", component: EditInventoryComponent },

          // Categories
          {
            path: "categories",
            children: [
              { path: "", component: CategoriesComponent },
              { path: "new", component: AddCategoryComponent },
              { path: ":categoryUuid", component: EditCategoryComponent }
            ]
          },

          // Things
          {
            path: "things",
            children: [
              { path: "", component: ThingsComponent },
              { path: "new", component: AddThingComponent },
              {
                path: ":thingUuid",
                children: [
                  { path: "", component: EditThingComponent },

                  // Stocks
                  {
                    path: "stocks",
                    children: [
                      { path: "", component: StocksComponent },
                      { path: "new", component: AddStockComponent },
                      { path: ":stockUuid", component: EditStockComponent }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // Page not found (fallback)
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
