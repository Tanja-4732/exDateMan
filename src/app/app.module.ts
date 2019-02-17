import { DBConnectionService } from "./services/DBConnection/dbconnection.service";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

import { FormsModule /* , ReactiveFormsModule */ } from "@angular/forms";
import {
  MatCheckboxModule,
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSliderModule,
  MatToolbarModule,
  MatDialogModule
} from "@angular/material";

import { AppComponent } from "./app.component";
import { ThingCardComponent } from "./components/thing-card/thing-card.component";
import { StockCardComponent } from "./components/stock-card/stock-card.component";
import { ThingsComponent } from "./components/things/things.component";
import { AddThingComponent } from "./components/add-thing/add-thing.component";
import { AddStockComponent } from "./components/add-stock/add-stock.component";

import { StocksComponent } from "./components/stocks/stocks.component";
import { EditStockComponent } from "./components/edit-stock/edit-stock.component";
import {
  EditThingComponent,
  DeleteConfirmationDialogComponent
} from "./components/edit-thing/edit-thing.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { InventoriesComponent } from './components/inventories/inventories.component';

@NgModule({
  declarations: [
    AppComponent,
    ThingCardComponent,
    StockCardComponent,
    ThingsComponent,
    AddThingComponent,
    AddStockComponent,
    StocksComponent,
    EditStockComponent,
    EditThingComponent,
    LoginComponent,
    RegisterComponent,
    DeleteConfirmationDialogComponent,
    PageNotFoundComponent,
    InventoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatToolbarModule,
    MatDialogModule
  ],
  providers: [DBConnectionService],
  bootstrap: [AppComponent],
  entryComponents: [DeleteConfirmationDialogComponent]
})
export class AppModule {}
