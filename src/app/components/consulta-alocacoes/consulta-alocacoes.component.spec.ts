import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAlocacoesComponent } from './consulta-alocacoes.component';

describe('ConsultaAlocacoesComponent', () => {
  let component: ConsultaAlocacoesComponent;
  let fixture: ComponentFixture<ConsultaAlocacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaAlocacoesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaAlocacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
