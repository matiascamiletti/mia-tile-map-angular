import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { TileMapCanvaComponent } from './components/tile-map-canva/tile-map-canva.component';
import { MoveButtonComponent } from './components/move-button/move-button.component';



@NgModule({
  declarations: [
    TileMapCanvaComponent,
    MoveButtonComponent
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
