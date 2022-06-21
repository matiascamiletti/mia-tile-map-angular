import { NgModule } from '@angular/core';
import { TileMapComponent } from './tile-map.component';
import { TileMapCanvaComponent } from './components/tile-map-canva/tile-map-canva.component';



@NgModule({
  declarations: [
    TileMapComponent,
    TileMapCanvaComponent
  ],
  imports: [
  ],
  exports: [
    TileMapComponent,
    TileMapCanvaComponent
  ]
})
export class TileMapModule { }
