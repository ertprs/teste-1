import { TestBed } from '@angular/core/testing';

import { ListatransmissaoService } from './listatransmissao.service';

describe('ListatransmissaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListatransmissaoService = TestBed.get(ListatransmissaoService);
    expect(service).toBeTruthy();
  });
});
