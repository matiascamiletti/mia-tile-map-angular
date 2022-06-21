import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileMapCanvaComponent } from './tile-map-canva.component';

describe('TileMapCanvaComponent', () => {
  let component: TileMapCanvaComponent;
  let fixture: ComponentFixture<TileMapCanvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TileMapCanvaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TileMapCanvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
