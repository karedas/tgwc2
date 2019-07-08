import { TestBed } from '@angular/core/testing';

import { VerifyCharacterService } from './verify-character.service';

describe('VerifyCharacterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VerifyCharacterService = TestBed.get(VerifyCharacterService);
    expect(service).toBeTruthy();
  });
});
