import { TestBed } from '@angular/core/testing';

import { AmonestacionesService } from './amonestaciones.service';

describe('AmonestacionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmonestacionesService = TestBed.get(AmonestacionesService);
    expect(service).toBeTruthy();
  });
});
