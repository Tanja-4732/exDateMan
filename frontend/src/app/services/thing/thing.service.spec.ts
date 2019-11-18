import { TestBed } from '@angular/core/testing';

import { ThingService } from './thing.service';

describe('ThingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThingService = TestBed.get(ThingService);
    expect(service).toBeTruthy();
  });
});
