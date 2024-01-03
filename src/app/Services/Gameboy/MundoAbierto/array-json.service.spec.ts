import { TestBed } from '@angular/core/testing';

import { ArrayJsonService } from './array-json.service';

describe('ArrayJsonService', () => {
  let service: ArrayJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrayJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
