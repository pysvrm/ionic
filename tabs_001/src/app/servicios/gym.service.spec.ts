import { TestBed } from '@angular/core/testing';

import { GymService } from './gym.service';

describe('GymService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GymService = TestBed.get(GymService);
    expect(service).toBeTruthy();
  });
});
