import { TestBed } from '@angular/core/testing';

import { CheckServiciosService } from './check-servicios.service';

describe('CheckServiciosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckServiciosService = TestBed.get(CheckServiciosService);
    expect(service).toBeTruthy();
  });
});
