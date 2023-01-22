import { TestBed } from '@angular/core/testing';

import { FbserviceService } from './fbservice.service';

describe('FbserviceService', () => {
  let service: FbserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FbserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
