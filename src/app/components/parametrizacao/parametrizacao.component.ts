import { Component, OnInit } from "@angular/core";
import { Parametrizacao } from "src/app/models/parametrizacao.model";

import { ParametrizacaoService } from "./../../services/parametrizacao/parametrizacao.service";

@Component({
  selector: "app-parametrizacao",
  templateUrl: "./parametrizacao.component.html",
  styleUrls: ["./parametrizacao.component.scss"],
})
export class ParametrizacaoComponent implements OnInit {
  parametrizacao: Parametrizacao;
  constructor(private parametrizacaoService: ParametrizacaoService) {}

  ngOnInit(): void {
    this.parametrizacao = new Parametrizacao();
    this.getParametrizacao();
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
}
