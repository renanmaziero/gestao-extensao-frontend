import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConsultaAlocacoesService } from "./../../services/consulta-alocacoes/consulta-alocacoes.service";
import { TotalHorasAprovadas } from "src/app/models/total-horas-aprovadas.model";
import { ConsultaAlocacoes } from "src/app/models/consulta-alocacoes.model";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Parametrizacao } from 'src/app/models/parametrizacao.model';
import { ParametrizacaoService } from './../../services/parametrizacao/parametrizacao.service';

@Component({
  selector: "app-consulta-alocacoes",
  templateUrl: "./consulta-alocacoes.component.html",
  styleUrls: ["./consulta-alocacoes.component.scss"],
})
export class ConsultaAlocacoesComponent implements OnInit {
  consultaAlocacoes = new ConsultaAlocacoes();
  alocacoes: MatTableDataSource<ConsultaAlocacoes>;
  conveniosConsulta: number = 0;
  cursosConsulta: number = 0;
  regenciasConsulta: number = 0;
  max_hr_semestrais_convenio: number;
  max_hr_semestrais_curso: number;
  max_hr_semestrais_regencia: number;
  porcCursos:number = 0;
  porcConvenios:number = 0;
  porcRegencias:number = 0;
  ano: number = new Date().getFullYear();
  semestreSelecionado: number = 1;
  anoSelecionado: number = this.ano;
  parametrizacao: Parametrizacao;
  totalHorasAlocacoes = new TotalHorasAprovadas();  
  conveniosTotais: number = 0;
  cursosTotais: number = 0;
  regenciasTotais: number = 0;
  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'determinate';
  bufferValue = 20;
  admin: boolean = false;
  idLogado: string = this.tokenStorage.getUserId();
  perfil: string[] = this.tokenStorage.getAuthorities();

  constructor(private consultaAlocacoesService: ConsultaAlocacoesService, private fbuilder: FormBuilder,private tokenStorage: TokenStorageService,private parametrizacaoService: ParametrizacaoService,) {}

  ngOnInit(): void {
    if(this.perfil.includes('ROLE_ADMIN')){
      this.admin = true;
    } else {this.admin = false;}
    this.getParametrizacao();
  }

  totalHorasAprovadas(docenteId: number): void {
    this.consultaAlocacoesService.totalHorasAprovadas(docenteId).subscribe(
      (data) => {
        this.totalHorasAlocacoes = data;
        this.conveniosTotais = this.totalHorasAlocacoes[0];
        this.cursosTotais = this.totalHorasAlocacoes[1];
        this.regenciasTotais = this.totalHorasAlocacoes[2];
      },
      (erro) => {
        console.log(erro);
      }
    );
  }

  consultarAlocacoes(): void {
    this.consultaAlocacoesService.consultarAlocacoes(parseInt(this.idLogado), this.semestreSelecionado, this.anoSelecionado).subscribe(
      (data) => {
        this.consultaAlocacoes = data;
        this.conveniosConsulta = this.consultaAlocacoes[0];
        this.cursosConsulta = this.consultaAlocacoes[1];
        this.regenciasConsulta = this.consultaAlocacoes[2];
        this.porcCursos = parseFloat(((this.cursosConsulta/this.max_hr_semestrais_curso)*100).toFixed(2));
        this.porcRegencias = parseFloat(((this.regenciasConsulta/this.max_hr_semestrais_regencia)*100).toFixed(2));
        this.porcConvenios = parseFloat(((this.conveniosConsulta/this.max_hr_semestrais_convenio)*100).toFixed(2));
      },
      (erro) => {
        console.log(erro);
      }
    );
  }
  getParametrizacao(): void {
    this.parametrizacaoService.consultarParametrizacao().subscribe(
      (data) => {
        this.parametrizacao = data[0];
        this.max_hr_semestrais_convenio = this.parametrizacao.max_hr_semestrais_convenio;
        this.max_hr_semestrais_curso = this.parametrizacao.max_hr_semestrais_curso;
        this.max_hr_semestrais_regencia = this.parametrizacao.max_hr_semestrais_regencia;
      },
      (erro) => {
        console.log(erro);
      }
    );
  }
}