import { FormGroup, FormBuilder } from '@angular/forms';
import { ConsultaAlocacoesService } from "./../../services/consulta-alocacoes/consulta-alocacoes.service";
import { ConsultaAlocacoes } from "src/app/models/consulta-alocacoes.model";
import { Component, OnInit } from "@angular/core";
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';

@Component({
  selector: "app-consulta-alocacoes",
  templateUrl: "./consulta-alocacoes.component.html",
  styleUrls: ["./consulta-alocacoes.component.scss"],
})
export class ConsultaAlocacoesComponent implements OnInit {
  consultaAlocacoes: ConsultaAlocacoes;
  form: FormGroup;
  convenios: number;
  cursos: number;
  regencias: number;  
  admin: boolean;
  perfil: string[] = [];

  constructor(private consultaAlocacoesService: ConsultaAlocacoesService, private fbuilder: FormBuilder,private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.perfil = this.tokenStorage.getAuthorities();
    if(this.perfil.includes('ROLE_ADMIN')){
      this.admin = true;
    } else {this.admin = false;}

    this.consultaAlocacoes = new ConsultaAlocacoes();
    this.getAlocacoes(34);  

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
}