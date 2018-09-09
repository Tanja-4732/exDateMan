import { AddThingComponent } from './add-thing/add-thing.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ThingsComponent } from "./things/things.component";

const routes: Routes = [
  { path: "", redirectTo: "/things", pathMatch: "full" },
  { path: "things", component: ThingsComponent },
  { path: "addThing", component: AddThingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
