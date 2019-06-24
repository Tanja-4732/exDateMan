import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";

import { QRCodeModule } from "angularx-qrcode";

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { ThingCardComponent } from "./components/thing-card/thing-card.component";
import { StockCardComponent } from "./components/stock-card/stock-card.component";
import { ThingsComponent } from "./components/things/things.component";
import { AddThingComponent } from "./components/add-thing/add-thing.component";
import { AddStockComponent } from "./components/add-stock/add-stock.component";
import { StocksComponent } from "./components/stocks/stocks.component";
import { EditStockComponent } from "./components/edit-stock/edit-stock.component";
import { EditThingComponent } from "./components/edit-thing/edit-thing.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { InventoriesComponent } from "./components/inventories/inventories.component";
import { MainNavComponent } from "./components/main-nav/main-nav.component";
import { LayoutModule } from "@angular/cdk/layout";
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { EditInventoryComponent } from "./components/edit-inventory/edit-inventory.component";
import { AddInventoryComponent } from "./components/add-inventory/add-inventory.component";
import { InventoryCardComponent } from "./components/inventory-card/inventory-card.component";
import { DeleteConfirmationDialogComponent } from "./components/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { AccountComponent } from "./components/account/account.component";

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
    PageNotFoundComponent,
    InventoriesComponent,
    MainNavComponent,
    WelcomeComponent,
    EditInventoryComponent,
    AddInventoryComponent,
    InventoryCardComponent,
    DeleteConfirmationDialogComponent,
    AccountComponent
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
    MatDialogModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    ReactiveFormsModule,
    QRCodeModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DeleteConfirmationDialogComponent]
})
export class AppModule {}
