import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TileMapProperties } from '../../entities/tile-map-properties';

@Component({
  selector: 'mia-move-button',
  templateUrl: './move-button.component.html',
  styleUrls: ['./move-button.component.scss']
})
export class MoveButtonComponent implements OnInit {

  @Input() properties!: TileMapProperties;

  @Output() draw = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickMoveLayerLeft() {
    if(this.properties.layerX > this.properties.layerWidth){ return; }
    this.properties.layerX -= this.properties.sizeTileWidth;
    this.draw.emit(true);
  }

  onClickMoveLayerRight() {
    if(this.properties.layerX >= 0){ return; }
    this.properties.layerX += this.properties.sizeTileWidth;
    this.draw.emit(true);
  }

  onClickMoveLayerUp() {
    if(this.properties.layerY > this.properties.layerHeight){
      return;
    }
    this.properties.layerY -= this.properties.sizeTileHeight;
    this.draw.emit(true);
  }

  onClickMoveLayerDown() {
    if(this.properties.layerY >= 0){
      return;
    }
    this.properties.layerY += this.properties.sizeTileHeight;
    this.draw.emit(true);
  }
}
