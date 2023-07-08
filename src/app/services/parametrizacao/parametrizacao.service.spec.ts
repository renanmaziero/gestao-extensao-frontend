import { TestBed } from '@angular/core/testing';

import { ParametrizacaoService } from './parametrizacao.service';

describe('ParametrizacaoService', () => {
  let service: ParametrizacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrizacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
