import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'mia-tile-map-canva',
  templateUrl: './tile-map-canva.component.html',
  styleUrls: ['./tile-map-canva.component.scss']
})
export class TileMapCanvaComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Input() width: number = 0;
  @Input() height: number = 0;

  ctx?: CanvasRenderingContext2D | null;

  layerX = 0;
  layerY = 0;
  layerWidth = 3116;
  layerHeight = 2416;
  scale = 1;
  isChangeScale = false;
  isCenterCoords = true;

  sizeTileWidth = 10;
  sizeTileHeight = 10;

  backgroundPath?: string = '/assets/map_10.png';
  backgroundImageSource?: HTMLImageElement;
  isBackgroundLoaded = false;

  testParcel = '';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.loadConfig();
  }

  ngAfterViewInit(): void {
    this.initContext2D();
    this.loadBackground();
    this.draw();
  }

  ngOnInit(): void {
    
  }

  onClickMoveLayerLeft() {
    if(this.layerX > this.layerWidth){ return; }
    this.layerX -= this.sizeTileWidth;
    this.draw();
  }

  onClickMoveLayerRight() {
    if(this.layerX >= 0){ return; }
    this.layerX += this.sizeTileWidth;
    this.draw();
  }

  onClickMoveLayerUp() {
    if(this.layerY > this.layerHeight){
      return;
    }
    this.layerY -= this.sizeTileHeight;
    this.draw();
  }

  onClickMoveLayerDown() {
    if(this.layerY >= 0){
      return;
    }
    this.layerY += this.sizeTileHeight;
    this.draw();
  }

  onClickScaleMax() {
    this.scale = 1.25;
    this.isChangeScale = true;
    this.draw();
  }

  onClickScaleMin() {
    this.scale = 0.75;
    this.isChangeScale = true;
    this.draw();
  }

  draw() {
    this.clean();
    if(this.isChangeScale){
      // Set Scale
      this.ctx?.scale(this.scale, this.scale);
      this.isChangeScale = false;
    }
    
    this.drawBackground();
    this.drawGrid();
  }

  clean(){
    this.ctx!.fillStyle = 'black';
    this.ctx?.fillRect(0, 0, this.layerWidth, this.layerHeight);
  }

  refresh() {
    this.draw();
  }

  drawGrid() {
    // Draw horizontal lines
    let current = 0;
    while(current < this.layerWidth) {
      this.drawLine(current + this.layerX, 0, current + this.layerX, this.layerHeight);
      current += this.sizeTileWidth;
    }

    // Draw Vertical Lines
    let currentY = 0;
    while(currentY < this.layerHeight) {
      this.drawLine(0, currentY + this.layerY, this.layerWidth, currentY + this.layerY);
      currentY += this.sizeTileHeight;
    }
  }

  drawBackground() {
    if(!this.isBackgroundLoaded){ return; }

    this.ctx?.fillRect(0, 0, this.layerWidth, this.layerHeight);
    this.ctx?.drawImage(this.backgroundImageSource!, this.layerX, this.layerY, this.layerWidth, this.layerHeight);
  }

  drawLine(ax: number, ay: number, bx: number, by: number) {
    this.ctx!.lineWidth = 1;

    this.ctx?.beginPath();
    this.ctx?.moveTo(ax, ay);
    this.ctx?.lineTo(bx, by);
    this.ctx?.stroke();
  }

  drawImage(path: string, sx: number, sy: number, sw: number, sh: number) {
    var image = new Image();
    image.onload = () => {
      this.ctx?.drawImage(image, sx, sy, sw, sh);
    };
    image.src = path;
  }

  drawImageFull(path: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) {
    var image = new Image();
    image.onload = () => {
      this.ctx?.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    };
    image.src = path;
  }

  calcCoordXCenter(pointX: number): number {
    let firstX = ~~((this.layerWidth / 2) / this.sizeTileWidth);
    let pointLayerX = ~~(pointX / (this.sizeTileWidth * this.scale));
    let layerBlockX = this.layerX / this.sizeTileWidth;
    return pointLayerX - firstX - layerBlockX;
  }

  calcCoordYCenter(pointY: number): number {
    let firstY = ~~((this.layerHeight / 2) / this.sizeTileHeight);
    let pointLayerY = ~~(pointY / (this.sizeTileHeight * this.scale));
    let layerBlockY = this.layerY / this.sizeTileHeight;
    return pointLayerY - firstY - layerBlockY;
  }

  mouseOver(event: MouseEvent) {
    // Coordenadas del mouse
    //event.offsetX;
    //event.offsetY;

    // grid
    if(this.isCenterCoords) {
      this.testParcel = 'X: ' + this.calcCoordXCenter(event.offsetX)  + ' - Y: ' + this.calcCoordYCenter(event.offsetY);
    } else {
      this.testParcel = 'X: ' + ~~(event.offsetX / (this.sizeTileWidth * this.scale)) + ' - Y: ' + ~~(event.offsetY / (this.sizeTileHeight * this.scale));
    }
  }

  loadBackground() {
    this.backgroundImageSource = new Image();
    this.backgroundImageSource.onload = () => {
      this.isBackgroundLoaded = true;
      // Save image size
      this.layerWidth = this.backgroundImageSource!.width;
      this.layerHeight = this.backgroundImageSource!.height;
      this.draw();
    };
    this.backgroundImageSource.src = this.backgroundPath!;
  }

  loadConfig() {
    this.width = this.document.body.clientWidth;
    this.height = this.document.body.clientHeight;
  }

  initContext2D() {
    if(this.canvas != undefined){
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }
  }

  getContext2D() {
    if(this.ctx != undefined || this.ctx != null){
      return this.ctx;
    }

    this.initContext2D();

    return this.ctx;
  }
}
