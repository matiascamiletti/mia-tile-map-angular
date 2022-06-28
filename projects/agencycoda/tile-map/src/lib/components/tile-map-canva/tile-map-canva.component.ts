import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TileMapProperties } from '../../entities/tile-map-properties';
import { PointHelper } from '../../helpers/point-helper';

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

  properties = new TileMapProperties();

  isChangeScale = false;
  isCenterCoords = true;

  backgroundPath?: string = '/assets/map_10.png';
  backgroundImageSource?: HTMLImageElement;
  isBackgroundLoaded = false;

  testParcel = '';

  isActiveEdit = false;
  isActiveErase = false;
  data: Array<any> = [];

  moduleActive: any;
  modulesEdit = [
    { title: 'Parcel 1', active: false, icon: '', data: [
      { 'x': 0, 'y': 0, 'color': '#eee'}
    ] },

    { title: 'Parcel 2', active: false, icon: '', data: [
      { 'x': 0, 'y': 0, 'color': 'red'}
    ] },

    { title: 'Parcel 4', active: false, icon: '', data: [
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

  onClickScaleMax() {
    this.properties.scale = 1.25;
    this.isChangeScale = true;
    this.draw();
  }

  onClickScaleMin() {
    this.properties.scale = 0.75;
    this.isChangeScale = true;
    this.draw();
  }

  onClickErase() {
    this.deactivateAllModules();
    this.isActiveEdit = false;
    this.isActiveErase = true;
  }

  onClickModule(module: any) {
    this.deactivateAllModules();

    module.active = true;
    console.log(this.modulesEdit);
    this.isActiveEdit = true;
    this.isActiveErase = false;
    this.moduleActive = module;
  }

  draw() {
    this.clean();
    if(this.isChangeScale){
      // Set Scale
      this.ctx?.scale(this.properties.scale, this.properties.scale);
      this.isChangeScale = false;
    }
    
    this.drawBackground();
    this.drawParcels();
    this.drawGrid();
  }

  clean(){
    this.ctx!.fillStyle = 'black';
    this.ctx?.fillRect(0, 0, this.properties.layerWidth, this.properties.layerHeight);
  }

  refresh() {
    this.draw();
  }

  drawParcels() {
    this.data.forEach(p => {
      this.ctx!.fillStyle = p.color;
      this.ctx?.fillRect(
        PointHelper.coordXToPixels(this.properties, p.x),
        PointHelper.coordYToPixels(this.properties, p.y),
        this.properties.sizeTileWidth,
        this.properties.sizeTileHeight);
    });
  }

  drawGrid() {
    this.ctx!.fillStyle = 'black';
    // Draw horizontal lines
    let current = 0;
    while(current < this.properties.layerWidth) {
      this.drawLine(current + this.properties.layerX, 0, current + this.properties.layerX, this.properties.layerHeight);
      current += this.properties.sizeTileWidth;
    }

    // Draw Vertical Lines
    let currentY = 0;
    while(currentY < this.properties.layerHeight) {
      this.drawLine(0, currentY + this.properties.layerY, this.properties.layerWidth, currentY + this.properties.layerY);
      currentY += this.properties.sizeTileHeight;
    }
  }

  drawBackground() {
    if(!this.isBackgroundLoaded){ return; }

    this.ctx?.fillRect(0, 0, this.properties.layerWidth, this.properties.layerHeight);
    this.ctx?.drawImage(this.backgroundImageSource!, this.properties.layerX, this.properties.layerY, this.properties.layerWidth, this.properties.layerHeight);
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
      this.testParcel = 'X: ' + PointHelper.coordXCenter(this.properties, event.offsetX)  + ' - Y: ' + PointHelper.coordYCenter(this.properties, event.offsetY);
    } else {
      this.testParcel = 'X: ' + ~~(event.offsetX / (this.properties.sizeTileWidth * this.properties.scale)) + ' - Y: ' + ~~(event.offsetY / (this.properties.sizeTileHeight * this.properties.scale));
    }
  }

  mouseUp(event: MouseEvent) {
    let coordX = PointHelper.coordXCenter(this.properties, event.offsetX);
    let coordY = PointHelper.coordYCenter(this.properties, event.offsetY);

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
    this.properties.layerWidth = this.backgroundImageSource!.width;
    this.properties.layerHeight = this.backgroundImageSource!.height;

    // Create all parcels
    //this.data = [];
    /*for (let x = 0; x < this.layerWidth; x+=this.sizeTileWidth) {
      for (let y = 0; y < this.layerHeight; x+=this.sizeTileHeight) {
        this.data.push({ 'x': x, 'y': y, 'color': ''});
      }
    }*/
    //console.log(this.data);
  }

  deactivateAllModules() {
    this.modulesEdit.map(m => m.active = false);
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
