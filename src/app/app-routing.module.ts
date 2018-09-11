import { EditThingComponent } from './edit-thing/edit-thing.component';
import { EditStockComponent } from "./edit-stock/edit-stock.component";
import { AddStockComponent } from "./add-stock/add-stock.component";
import { StocksComponent } from "./stocks/stocks.component";
import { AddThingComponent } from "./add-thing/add-thing.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ThingsComponent } from "./things/things.component";

const routes: Routes = [
  { path: "", redirectTo: "/things", pathMatch: "full" },
  { path: "things", component: ThingsComponent },
  { path: "addThing", component: AddThingComponent },
  { path: "thing/:thingName", component: StocksComponent },
  { path: "thing/:thingName/edit-thing", component: EditThingComponent },
  { path: "thing/:thingName/add-stock", component: AddStockComponent },
  { path: "thing/:thingName/stock/:stockId", component: EditStockComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
