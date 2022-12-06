import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Parametrizacao } from 'src/app/models/parametrizacao.model';

import { ParametrizacaoService } from './../../services/parametrizacao/parametrizacao.service';

@Component({
  selector: "app-parametrizacao",
  templateUrl: "./parametrizacao.component.html",
  styleUrls: ["./parametrizacao.component.scss"],
})
export class ParametrizacaoComponent implements OnInit {
  parametrizacao: Parametrizacao;
  form: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  
  constructor(
    private parametrizacaoService: ParametrizacaoService,
    private fbuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.parametrizacao = new Parametrizacao();
    this.getParametrizacao();

    this.form = this.fbuilder.group({
      //this.formularioCadastro.get('nome_completo').value,
      max_hr_semanais_convenio: [null],
      max_hr_mensais_convenio: [null],
      max_hr_semestrais_convenio: [null],
      max_hr_ministradas_curso: [null],
      max_hr_semestrais_curso: [null],
      max_hr_semestrais_regencia: [null],
    });
  }

  getParametrizacao(): void {
    this.parametrizacaoService.consultarParametrizacao().subscribe(
      (data) => {
        this.parametrizacao = data[0];
      },
      (erro) => {
        console.log(erro);
      }
    );
  }

  updateParametrizacao(): void {
    this.parametrizacaoService
      .updateParametrizacao(this.parametrizacao)
      .subscribe(
        (data) => {
          this.openSnackBar("Atualizado com sucesso.", "OK");
          this.router.navigate(['/dashboard']);
        },
        (erro) => {
          this.toast.error("Erro ao atualizar.");
          this.router.navigate(['/dashboard']);
        }
      );
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 15000,
      horizontalPosition: this.horizontalPosition,
    });
  }
}
