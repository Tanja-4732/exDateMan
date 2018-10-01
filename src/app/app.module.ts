import { DBConnectionService } from './services/DBConnection/dbconnection.service';
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
import { ThingCardComponent } from "./thing-card/thing-card.component";
import { StockCardComponent } from "./stock-card/stock-card.component";
import { ThingsComponent } from "./things/things.component";
import { AddThingComponent } from "./add-thing/add-thing.component";
import { AddStockComponent } from "./add-stock/add-stock.component";

import { StocksComponent } from "./stocks/stocks.component";
import { EditStockComponent } from "./edit-stock/edit-stock.component";
import { EditThingComponent } from "./edit-thing/edit-thing.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from './register/register.component';

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
    RegisterComponent
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
  bootstrap: [AppComponent]
})
export class AppModule {}
