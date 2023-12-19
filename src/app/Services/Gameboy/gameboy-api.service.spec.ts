import { TestBed } from '@angular/core/testing';

import { GameboyAPIService } from './gameboy-api.service';

describe('GameboyAPIService', () => {
  let service: GameboyAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameboyAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
