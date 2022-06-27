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

  isActiveEdit = false;
  isActiveErase = false;
  data: Array<any> = [];

  moduleActive: any;
  modulesEdit = [
    { title: 'Parcel 1', icon: '', data: [
      { 'x': 0, 'y': 0, 'color': '#eee'}
    ] },

    { title: 'Parcel 2', icon: '', data: [
      { 'x': 0, 'y': 0, 'color': 'red'}
    ] },

    { title: 'Parcel 4', icon: '', data: [
      { 'x': 0, 'y': 0, 'color': 'red'},
      { 'x': 1, 'y': 0, 'color': 'red'},
      { 'x': 2, 'y': 0, 'color': 'red'},
      { 'x': 1, 'y': 1, 'color': '#eee'},
      { 'x': 3, 'y': 3, 'color': 'black'},
    ] }
  ];

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

  onClickErase() {
    this.isActiveEdit = false;
    this.isActiveErase = true;
  }

  onClickModule(module: any) {
    this.isActiveEdit = true;
    this.isActiveErase = false;
    this.moduleActive = module;
  }

  draw() {
    this.clean();
    if(this.isChangeScale){
      // Set Scale
      this.ctx?.scale(this.scale, this.scale);
      this.isChangeScale = false;
    }
    
    this.drawBackground();
    this.drawParcels();
    this.drawGrid();
  }

  clean(){
    this.ctx!.fillStyle = 'black';
    this.ctx?.fillRect(0, 0, this.layerWidth, this.layerHeight);
  }

  refresh() {
    this.draw();
  }

  drawParcels() {
    this.data.forEach(p => {
      this.ctx!.fillStyle = p.color;
      this.ctx?.fillRect(
        this.calcCoordXToPixels(p.x),
        this.calcCoordYToPixels(p.y),
        this.sizeTileWidth,
        this.sizeTileHeight);
    });
  }

  drawGrid() {
    this.ctx!.fillStyle = 'black';
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

  calcCoordXToPixels(coordX: number): number {
    let firstX = ~~((this.layerWidth / 2) / this.sizeTileWidth);
    let layerBlockX = this.layerX / this.sizeTileWidth;
    return (coordX + firstX + layerBlockX) * this.sizeTileWidth;
  }

  calcCoordYToPixels(coordY: number): number {
    let firstY = ~~((this.layerHeight / 2) / this.sizeTileHeight);
    let layerBlockY = this.layerY / this.sizeTileHeight;
    return (coordY + firstY + layerBlockY) * this.sizeTileHeight;
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

  setParcelColor(coordX: number, coordY: number, color: string) {
    let parcel = this.data.find(p => p.x == coordX && p.y == coordY);
    if(parcel == undefined){
      this.data.push({ 'x': coordX, 'y': coordY, 'color': color});
    } else {
      parcel.color = color;
    }

    this.draw();
  }

  setModule(coordX: number, coordY: number) {
    this.moduleActive.data.forEach((d: any) => {
      let clon = Object.assign({}, d);
      clon.x += coordX;
      clon.y += coordY;
      this.removeParcel(clon.x, clon.y);
      this.data.push(clon);
    });
    this.draw();
  }

  removeParcel(coordX: number, coordY: number) {
    let item = this.data.find(p => p.x == coordX && p.y == coordY);
    if(item == undefined){
      return;
    }
    let index = this.data.indexOf(item);
    if(index >= 0){
      this.data.splice(index, 1);
    }
    
    this.draw();
  }

  mouseOver(event: MouseEvent) {
    // grid
    if(this.isCenterCoords) {
      this.testParcel = 'X: ' + this.calcCoordXCenter(event.offsetX)  + ' - Y: ' + this.calcCoordYCenter(event.offsetY);
    } else {
      this.testParcel = 'X: ' + ~~(event.offsetX / (this.sizeTileWidth * this.scale)) + ' - Y: ' + ~~(event.offsetY / (this.sizeTileHeight * this.scale));
    }
  }

  mouseUp(event: MouseEvent) {
    let coordX = this.calcCoordXCenter(event.offsetX);
    let coordY = this.calcCoordYCenter(event.offsetY);

    if(this.isActiveErase){
      this.removeParcel(coordX, coordY);
    }

    if(this.isActiveEdit){
      this.setModule(coordX, coordY);
    }

    console.log('click: ' + coordX + ' - Y: ' + coordY);
  }

  loadBackground() {
    this.backgroundImageSource = new Image();
    this.backgroundImageSource.onload = () => {
      this.isBackgroundLoaded = true;
      this.loadSizes();
      this.draw();
    };
    this.backgroundImageSource.src = this.backgroundPath!;
  }

  loadConfig() {
    this.width = this.document.body.clientWidth;
    this.height = this.document.body.clientHeight;
  }

  loadSizes() {
    // Save image size
    this.layerWidth = this.backgroundImageSource!.width;
    this.layerHeight = this.backgroundImageSource!.height;

    // Create all parcels
    //this.data = [];
    /*for (let x = 0; x < this.layerWidth; x+=this.sizeTileWidth) {
      for (let y = 0; y < this.layerHeight; x+=this.sizeTileHeight) {
        this.data.push({ 'x': x, 'y': y, 'color': ''});
      }
    }*/
    //console.log(this.data);
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
