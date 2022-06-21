import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TileMapModule } from 'projects/agencycoda/tile-map/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TileMapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
