import { TestBed } from '@angular/core/testing';

import { CrowdService } from './crowd.service';

describe('CrowdService', () => {
  let service: CrowdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrowdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
