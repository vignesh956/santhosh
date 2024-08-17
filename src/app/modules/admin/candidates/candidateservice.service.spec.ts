import { TestBed } from '@angular/core/testing';

import { CandidateserviceService } from 'app//services/candidateservice.service';

describe('CandidateserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CandidateserviceService = TestBed.get(CandidateserviceService);
    expect(service).toBeTruthy();
  });
});
