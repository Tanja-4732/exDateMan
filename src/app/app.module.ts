import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";

import { FormsModule /* , ReactiveFormsModule */ } from "@angular/forms";
import {
  MatCheckboxModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule
} from "@angular/material";

import { AppComponent } from "./app.component";
import { ThingCardComponent } from "./thing-card/thing-card.component";
import { StockCardComponent } from "./stock-card/stock-card.component";
import { ThingsComponent } from "./things/things.component";
import { AddThingComponent } from "./add-thing/add-thing.component";
import { AddStockComponent } from "./add-stock/add-stock.component";
import { StocksComponent } from './stocks/stocks.component';
import { EditStockComponent } from './edit-stock/edit-stock.component';

@NgModule({
  declarations: [
    AppComponent,
    ThingCardComponent,
    StockCardComponent,
    ThingsComponent,
    AddThingComponent,
    AddStockComponent,
    StocksComponent,
    EditStockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
