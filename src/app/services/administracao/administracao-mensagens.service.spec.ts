import { TestBed } from '@angular/core/testing';

import { AdministracaoMensagensService } from './administracao-mensagens.service';

describe('AdministracaoMensagensService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdministracaoMensagensService = TestBed.get(AdministracaoMensagensService);
    expect(service).toBeTruthy();
  });
});
