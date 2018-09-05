import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule, MatCardModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThingCardComponent } from './thing-card/thing-card.component';
import { StockCardComponent } from './stock-card/stock-card.component';
import { ThingsComponent } from './things/things.component';


@NgModule({
  declarations: [
    AppComponent,
    ThingCardComponent,
    StockCardComponent,
    ThingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
