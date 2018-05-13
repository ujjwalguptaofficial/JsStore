import { TestBed, inject } from '@angular/core/testing';

import { IdbService } from './idb.service';

describe('IdbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdbService]
    });
  });

  it('should be created', inject([IdbService], (service: IdbService) => {
    expect(service).toBeTruthy();
  }));
});
