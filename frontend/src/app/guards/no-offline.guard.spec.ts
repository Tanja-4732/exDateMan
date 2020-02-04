import { TestBed, async, inject } from '@angular/core/testing';

import { NoOfflineGuard } from './no-offline.guard';

describe('NoOfflineGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoOfflineGuard]
    });
  });

  it('should ...', inject([NoOfflineGuard], (guard: NoOfflineGuard) => {
    expect(guard).toBeTruthy();
  }));
});
