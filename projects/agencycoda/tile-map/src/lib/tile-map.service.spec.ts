import { TestBed } from '@angular/core/testing';

import { TileMapService } from './tile-map.service';

describe('TileMapService', () => {
  let service: TileMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
