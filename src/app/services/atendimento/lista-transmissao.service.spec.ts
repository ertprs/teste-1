import { TestBed } from '@angular/core/testing';

import { ListaTransmissaoService } from './lista-transmissao.service';

describe('ListaTransmissaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListaTransmissaoService = TestBed.get(ListaTransmissaoService);
    expect(service).toBeTruthy();
  });
});
