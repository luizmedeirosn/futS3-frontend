import { TestBed } from '@angular/core/testing';

import { ChangesOnService } from './changes-on.service';

describe('ChangesOnService', () => {
  let service: ChangesOnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangesOnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
