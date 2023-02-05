import { TestBed } from '@angular/core/testing';

import { ConsultaAlocacoesService } from './consulta-alocacoes.service';

describe('ConsultaAlocacoesService', () => {
  let service: ConsultaAlocacoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaAlocacoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
