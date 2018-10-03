import { RegisterComponent } from './register/register.component';
import { LoginComponent } from "./login/login.component";
import { EditThingComponent } from "./edit-thing/edit-thing.component";
import { EditStockComponent } from "./edit-stock/edit-stock.component";
import { AddStockComponent } from "./add-stock/add-stock.component";
import { StocksComponent } from "./stocks/stocks.component";
import { AddThingComponent } from "./add-thing/add-thing.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ThingsComponent } from "./things/things.component";

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
