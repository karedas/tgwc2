import { TestBed } from '@angular/core/testing';

import { DialogV2Service } from './dialog-v2.service';

describe('DialogV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogV2Service = TestBed.get(DialogV2Service);
    expect(service).toBeTruthy();
  });
});
