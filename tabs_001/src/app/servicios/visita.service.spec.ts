import { TestBed } from '@angular/core/testing';

import { VisitaService } from './visita.service';

describe('VisitaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisitaService = TestBed.get(VisitaService);
    expect(service).toBeTruthy();
  });
});
