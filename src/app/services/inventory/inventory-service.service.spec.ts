import { TestBed } from '@angular/core/testing';

import { InventoryServiceService } from './inventory-service.service';

describe('InventoryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryServiceService = TestBed.get(InventoryServiceService);
    expect(service).toBeTruthy();
  });
});
