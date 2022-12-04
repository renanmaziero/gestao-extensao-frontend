import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';

import { ParametrizacaoComponent } from './parametrizacao.component';

describe('ParametrizacaoComponent', () => {
  let component: ParametrizacaoComponent;
  let fixture: ComponentFixture<ParametrizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrizacaoComponent ],
      imports: [MatInputModule,
        MatGridListModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
