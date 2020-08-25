import { TestBed } from '@angular/core/testing';

import { InquilinoService } from './inquilino.service';

describe('InquilinoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InquilinoService = TestBed.get(InquilinoService);
    expect(service).toBeTruthy();
  });
});
