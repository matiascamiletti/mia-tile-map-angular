import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileMapComponent } from './tile-map.component';

describe('TileMapComponent', () => {
  let component: TileMapComponent;
  let fixture: ComponentFixture<TileMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TileMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TileMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
