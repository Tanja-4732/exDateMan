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

  // Inventories
  {
    path: "inventories",
    children: [
      { path: "", component: InventoriesComponent },
      { path: "new", component: AddInventoryComponent },
      {
        path: ":inventoryId",
        children: [
          { path: "", component: EditInventoryComponent },
          {
            path: "things",
            children: [
              { path: "", component: ThingsComponent },
              { path: "new", component: AddThingComponent },
              {
                path: ":thingNo",
                children: [
                  { path: "", component: EditThingComponent },
                  {
                    path: "stocks",
                    children: [
                      { path: "", component: StocksComponent },
                      { path: "new", component: AddStockComponent },
                      { path: ":sockNo", component: EditStockComponent }
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
