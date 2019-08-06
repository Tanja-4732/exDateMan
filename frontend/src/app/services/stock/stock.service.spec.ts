import { TestBed } from '@angular/core/testing';

import { StockService } from './stock.service';

describe('StockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockService = TestBed.get(StockService);
    expect(service).toBeTruthy();
  });
});
