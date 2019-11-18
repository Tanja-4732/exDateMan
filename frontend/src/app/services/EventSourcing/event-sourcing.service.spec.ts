import { TestBed } from '@angular/core/testing';

import { EventSourcingService } from './event-sourcing.service';

describe('EventSourcingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventSourcingService = TestBed.get(EventSourcingService);
    expect(service).toBeTruthy();
  });
});
