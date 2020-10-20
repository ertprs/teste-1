import { TestBed } from '@angular/core/testing';

import { AprendizadoService } from './aprendizado.service';

describe('AprendizadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AprendizadoService = TestBed.get(AprendizadoService);
    expect(service).toBeTruthy();
  });
});
