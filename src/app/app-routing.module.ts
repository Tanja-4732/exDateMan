import { AddStockComponent } from './add-stock/add-stock.component';
import { StocksComponent } from './stocks/stocks.component';
import { AddThingComponent } from "./add-thing/add-thing.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ThingsComponent } from "./things/things.component";

const routes: Routes = [
  { path: "", redirectTo: "/things", pathMatch: "full" },
  { path: "things", component: ThingsComponent },
  { path: "addThing", component: AddThingComponent },
  { path: "thing/:thingName", component: StocksComponent},
  { path: "thing/:thingName/add-stock", component: AddStockComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
