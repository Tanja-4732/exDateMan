import { TestBed, inject } from '@angular/core/testing';

import { DBConnectionService } from './dbconnection.service';

describe('DBConnectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DBConnectionService]
    });
  });

  it('should be created', inject([DBConnectionService], (service: DBConnectionService) => {
    expect(service).toBeTruthy();
  }));
});
