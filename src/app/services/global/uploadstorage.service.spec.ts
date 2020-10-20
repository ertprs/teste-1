import { TestBed } from '@angular/core/testing';

import { UploadstorageService } from './uploadstorage.service';

describe('UploadstorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadstorageService = TestBed.get(UploadstorageService);
    expect(service).toBeTruthy();
  });
});
