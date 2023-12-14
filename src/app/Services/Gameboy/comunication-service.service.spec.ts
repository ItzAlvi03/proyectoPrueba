import { TestBed } from '@angular/core/testing';

import { ComunicationServiceService } from './comunication-service.service';

describe('ComunicationServiceService', () => {
  let service: ComunicationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
