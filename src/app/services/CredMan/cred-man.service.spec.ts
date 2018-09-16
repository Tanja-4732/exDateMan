import { TestBed, inject } from '@angular/core/testing';

import { CredManService } from './cred-man.service';

describe('CredManService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CredManService]
    });
  });

  it('should be created', inject([CredManService], (service: CredManService) => {
    expect(service).toBeTruthy();
  }));
});
