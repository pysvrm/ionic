import { TestBed } from '@angular/core/testing';

import { DeptoService } from './depto.service';

describe('DeptoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeptoService = TestBed.get(DeptoService);
    expect(service).toBeTruthy();
  });
});
