import { TestBed } from '@angular/core/testing';

import { SignalTransService } from './signal-trans.service';

describe('SignalTransService', () => {
  let service: SignalTransService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalTransService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
