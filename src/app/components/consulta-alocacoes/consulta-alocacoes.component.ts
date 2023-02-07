import { FormGroup, FormBuilder } from '@angular/forms';
import { ConsultaAlocacoesService } from "./../../services/consulta-alocacoes/consulta-alocacoes.service";
import { ConsultaAlocacoes } from "src/app/models/consulta-alocacoes.model";
import { Component, OnInit } from "@angular/core";
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "app-consulta-alocacoes",
  templateUrl: "./consulta-alocacoes.component.html",
  styleUrls: ["./consulta-alocacoes.component.scss"],
})
export class ConsultaAlocacoesComponent implements OnInit {
  consultaAlocacoes: ConsultaAlocacoes;
  alocacao: ConsultaAlocacoes = new ConsultaAlocacoes();
  alocacoes: MatTableDataSource<ConsultaAlocacoes>
  displayedColumns = ['id', 'status', 'dataInicio', 'dataFim', 'horasSolicitadas', 'horasAprovadas', 'tipoAtividade'];
  dataGrid: ConsultaAlocacoes[];
  filtro: string;
  form: FormGroup;
  convenios: number;
  cursos: number;
  regencias: number;  
  admin: boolean;
  idLogado: string;
  perfil: string[] = [];
  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'determinate';
  bufferValue = 20;

  constructor(private consultaAlocacoesService: ConsultaAlocacoesService, private fbuilder: FormBuilder,private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.perfil = this.tokenStorage.getAuthorities();
    this.idLogado = this.tokenStorage.getUserId();
    this.convenios = 0;
    this.cursos = 0;
    this.regencias = 0;
    if(this.perfil.includes('ROLE_ADMIN')){
      this.admin = true;
    } else {this.admin = false;}

    this.consultaAlocacoes = new ConsultaAlocacoes();
    this.getAlocacoes(parseInt(this.idLogado));  

    this.form = this.fbuilder.group({
      convenios: [null],
      cursos: [null],
      regencias: [null]
    });

  }

  getAlocacoes(docenteId: number): void {
    this.consultaAlocacoesService.consultarAlocacoes(docenteId).subscribe(
      (data) => {
        this.consultaAlocacoes = data;
        this.convenios = this.consultaAlocacoes[0];
        this.cursos = this.consultaAlocacoes[1];
        this.regencias = this.consultaAlocacoes[2];
      },
      (erro) => {
        console.log(erro);
      }
    );
  }

  applyFilter(value: string) {
    this.alocacoes.filter = value.trim().toLowerCase();
  }
}