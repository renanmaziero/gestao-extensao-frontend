import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';
import { Docente } from 'src/app/models/docente.model';
import { DocenteService } from 'src/app/services/docente/docente.service';

import { DocenteDetalheComponent } from './docente-detalhe/docente-detalhe.component';

@Component({
  selector: "app-docente",
  templateUrl: "./docente.component.html",
  styleUrls: ["./docente.component.scss"],
})
export class DocenteComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  docente: Docente;
  docentes: MatTableDataSource<any>;
  errorMsg: string;
  emailLogado: string;
  displayedColumns: string[] = [
    "matricula",
    "nome",
    "permissao",
    "email",
    "telefone",
    "titulo",
    "alocacoes",
  ];
  currentYear: number;
  dataGrid: Docente[];

  constructor(
    private docenteService: DocenteService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private tokenStorage: TokenStorageService,
  ) {
    this.docentes = new MatTableDataSource(this.dataGrid);
  }

  ngOnInit() {
    this.getDocentes();
    this.docente = new Docente();       
    this.emailLogado = this.tokenStorage.getEmail();
  }

  getDocentes(): void {
    this.currentYear = new Date().getFullYear();
    this.docenteService.listarDocentes().subscribe(
      (data) => {
        this.docentes = new MatTableDataSource(data);
        this.docentes.paginator = this.paginator;
      },
      (error) => {
        this.errorMsg = `${error.status}: ${JSON.parse(error.error).message}`;
        console.error(this.errorMsg);
      }
    );
  }

  openDialogDocente(id: number): void {
    this.dialog.open(DocenteDetalheComponent, {
      data: {
        width: "auto",
        height: "auto",
        id,
      },
    });
  }

  concederAdmin(id: number, docente: Docente){
    docente.admin = true;
    this.docenteService.alterarDadosUsuario(id, docente).subscribe(
      data => {
         this._snackBar.open('Admin definido com sucesso!', 'OK');
      },
      error => {
        this._snackBar.open('Não foi possível conceder. Favor contatar suporte.', 'OK');
      }
    );
  }

  revogarAdmin(id: number, docente: Docente){
    docente.admin = false;
    this.docenteService.alterarDadosUsuario(id, docente).subscribe(
      data => {
        this._snackBar.open('Admin revogado com sucesso!', 'OK');
      },
      error => {
        this._snackBar.open('Não foi possível revogar admin.', 'OK');
      }
    );
  }

  applyFilter(value: string) {
    this.docentes.filter = value.trim().toLowerCase();
  }}