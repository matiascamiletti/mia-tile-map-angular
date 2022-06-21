import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { TileMapCanvaComponent } from './components/tile-map-canva/tile-map-canva.component';



@NgModule({
  declarations: [
    TileMapCanvaComponent
  ],
  imports: [
    BrowserModule,

    MatButtonModule,
    MatIconModule
  ],
  exports: [
    TileMapCanvaComponent
  ]
})
export class TileMapModule { }
