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

const routes: Routes = [
  // { path: "", component:  },
  { path: "", redirectTo: "/things", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "login/:email", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "register/:email", component: RegisterComponent },
  { path: "things", component: ThingsComponent },
  { path: "addThing", component: AddThingComponent },
  { path: "thing/:thingName", component: StocksComponent },
  { path: "thing/:thingName/edit-thing", component: EditThingComponent },
  { path: "thing/:thingName/add-stock", component: AddStockComponent },
  { path: "thing/:thingName/stock/:stockId", component: EditStockComponent },
  { path: "", redirectTo: "/things", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
