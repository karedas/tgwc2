import { TestBed } from '@angular/core/testing';

import { NetworkStatusService } from './networkstatus.service';

describe('NetworkStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkStatusService = TestBed.get(NetworkStatusService);
    expect(service).toBeTruthy();
  });
});
