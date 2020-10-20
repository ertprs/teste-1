import { TestBed } from '@angular/core/testing';

import { AdministracaoService } from './administracao.service';

describe('AdministracaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdministracaoService = TestBed.get(AdministracaoService);
    expect(service).toBeTruthy();
  });
});
