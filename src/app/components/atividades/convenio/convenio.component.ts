import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';
import { Alocacao } from 'src/app/models/alocacao.model';
import { Arquivo } from 'src/app/models/arquivo.model';
import { Atividade } from 'src/app/models/atividade.model';
import { Autorizacao } from 'src/app/models/autorizacao.model';
import { Convenio } from 'src/app/models/convenio.model';
import { ExportService } from 'src/app/services/arquivo.service';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { AutorizacaoService } from 'src/app/services/autorizacao/autorizacao.service';
import { LoaderService } from 'src/app/services/loader.service';
import { UploadArquivoService } from 'src/app/services/upload/upload-arquivo.service';
import { ConfirmacaoDialogueComponent } from 'src/app/shared/confirmacao-dialogue/confirmacao-dialogue.component';
import { DevolucaoDialogueComponent } from '../../autorizacao/autorizacao-detalhes/devolucao-dialogue/devolucao-dialogue.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { AlocacaoDialogueComponent } from '../../alocacoes/alocacao-dialogue/alocacao-dialogue.component';
import { Parametrizacao } from 'src/app/models/parametrizacao.model';
import { ParametrizacaoService } from 'src/app/services/parametrizacao/parametrizacao.service';

@Component({
  selector: 'app-convenio',
  templateUrl: './convenio.component.html',
  styleUrls: ['./convenio.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ConvenioComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  loading$ = this.loader.loading$;
  pdf$ = false;
  arquivo$ = false;
  aceitar$ = false;
  atividade: Convenio;
  convenioForm: FormGroup;
  admin = false;
  user = false;
  private roles: string[];
  currentYear: number;
  confirmacaoDialogueRef: MatDialogRef<ConfirmacaoDialogueComponent>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  fileInfos$: Observable<Arquivo[]>;
  autorizacao: Autorizacao;
  tabelaAlocacoes: MatTableDataSource<Alocacao>;
  columnsToDisplay: string[] = ['semestre', 'ano', 'horasSolicitadas', 'status'];
  expandedElement: Alocacao | null;
  parametrizacao: Parametrizacao;
  max_hr_semanais_convenio: number; 
  max_hr_mensais_convenio: number;
  max_hr_semestrais_convenio: number;
  max_hr_ministradas_curso: number;
  max_hr_semestrais_curso: number;
  max_hr_semestrais_regencia: number;

  constructor(private route: ActivatedRoute, private fbuilder: FormBuilder,
    private atividadeService: AtividadeService, private tokenStorage: TokenStorageService,
    private autorizacaoService: AutorizacaoService, public dialog: MatDialog, private snackBar: MatSnackBar,
    private uploadService: UploadArquivoService, private router: Router, private arquivoService: ExportService,
    private loader: LoaderService, private parametrizacaoService: ParametrizacaoService) { }

  ngOnInit(): void {
    this.parametrizacao = new Parametrizacao();
    this.atividade = new Convenio();
    this.currentYear = new Date().getFullYear();
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.admin = this.roles.includes('ROLE_ADMIN');
      this.user = this.roles.includes('ROLE_USER');
    }

    this.getConvenios();
    this.getParametrizacao();
    
   

    if(this.admin == false){
      this.habilitaEdicaoAtividade();
    }
  }

  getParametrizacao(): void {
    this.parametrizacaoService.consultarParametrizacao().subscribe(
      (data) => {
        this.parametrizacao = data[0];
        this.max_hr_semanais_convenio = this.parametrizacao.max_hr_semanais_convenio; 
        this.max_hr_mensais_convenio = this.parametrizacao.max_hr_mensais_convenio;
        this.max_hr_semestrais_convenio = this.parametrizacao.max_hr_semestrais_convenio;
        this.max_hr_ministradas_curso = this.parametrizacao.max_hr_ministradas_curso;
        this.max_hr_semestrais_curso = this.parametrizacao.max_hr_semestrais_curso;
        this.max_hr_semestrais_regencia = this.parametrizacao.max_hr_semestrais_regencia;

        this.criarForm();
      },
      (erro) => {
        console.log(erro);
      }
    );
  }

  criarForm(): void {
    this.convenioForm = this.fbuilder.group({
      instituicao: [null, Validators.required],
      projeto: [null, Validators.required],
      coordenador: [null, Validators.required],
      horaSemanal: [null, Validators.required],
      //horaSemanal: [null, [Validators.required, Validators.max(this.max_hr_semanais_convenio)]],
      horaMensal: [null, Validators.required],
      descricao: [null, Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      valorBruto: [null, Validators.required],
      prazo: [null, Validators.required],
      valor: [null, Validators.required],
      docente: [null, Validators.required],
      observacao: [null],
      revisao: [null],
      excedido: [null],
      ano: [null],
      semestre: [null],
      horasSolicitadas: [null],
      ano2: [null],
      semestre2: [null],
      horasSolicitadas2: [null],
      tipoAtividadeSimultanea: [null, Validators.required],
      horasAprovadasConvenio: [null],
      horasAprovadasCurso: [null],
      horasAprovadasRegencia: [null]
    });
  }

  getConvenios(): void {
    this.atividadeService.consultarConvenio(this.route.snapshot.params['id']).subscribe(
      response => {
        //console.log(response);
        this.atividade = response;

        if (this.atividade.excedido) {
          this.convenioForm.get("excedido").setValue('Limite de horas já comprometido para este semestre.');
        } else this.convenioForm.get('excedido').setValue('Sem restrições');

        this.tabelaAlocacoes = new MatTableDataSource(this.atividade.alocacoes);
        //console.log(this.atividade);

        this.fileInfos$ = this.uploadService.getArquivos(this.atividade.id);
      },
      error => {
        //console.log(error);
      });
  }

  habilitaEdicaoAtividade(): void {
    document.getElementById("detalhes-atividade").classList.remove("read-only");
  }

  autorizarAtividade(atividade: Atividade): void {
    this.autorizacaoService.autorizar(atividade).subscribe(
      res => {
        this.openSnackBar('Atividade aceita com sucesso!', 'OK');
        this.getConvenios();
      },
      error => {
        //console.log(error);
      });
  }

  updateConvenio(atividade: Convenio): void {
    this.atividadeService.updateConvenio(atividade).subscribe(
      res => {
        this.openSnackBar('Dados de atividade atualizados com sucesso', 'OK');
        this.getConvenios();
      },
      error => {
        //console.log(error);
      });
  }

  extrairRelatorioPDF(atividade: Atividade): void {
    this.pdf$ = true;
    this.arquivo$ = false;
    this.aceitar$ = false;
    this.arquivoService.extrairRelatorioPDF(atividade);
  }

  openConfirmationDialog(atividade: Atividade, mensagem: string, aceitar: boolean, operacao: string) {
    this.confirmacaoDialogueRef = this.dialog.open(ConfirmacaoDialogueComponent, {
      disableClose: false
    });
    this.confirmacaoDialogueRef.componentInstance.mensagem = mensagem;

    if (operacao === 'aceitar') {
      this.confirmacaoDialogueRef.afterClosed().subscribe(result => {
        if (result && aceitar) {
          atividade.autorizado = true;
          this.aceitar$ = true;
          this.arquivo$ = false;
          this.pdf$ = false;
          this.autorizarAtividade(atividade);
          this.router.navigate(['/autorizacoes']);
          this.getConvenios();

        }
      });
    }

    if (operacao === 'update') {
      this.confirmacaoDialogueRef.afterClosed().subscribe(result => {
        if (result && aceitar) {
          this.updateConvenio(this.atividade);
          this.router.navigate(['/autorizacoes']);
          this.getConvenios();
        }
      });
    }
  }

  devolverAtividade(id: number): void {
    const dialogRef = this.dialog.open(DevolucaoDialogueComponent, {
      data: {
        width: 'auto',
        height: 'auto',
        id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.openSnackBar('Atividade devolvida para revisão', 'OK');
        this.router.navigate(['/autorizacoes']);
      }
    }
    );
  }

  gerenciaBtnsAdmin(status: string): void {
    document.getElementById("detalhes-atividade").classList.add("read-only");
   
    if(status != 'PENDENTE'){
      document.getElementById("btnDevolver").style.display = "none";
      document.getElementById("btnAceitar").style.display = "none";    
    } 
  }

  gerenciaBtnsDocente(status: string): void {
    if(status == 'APROVADO' || status == 'PENDENTE'){
      document.getElementById("detalhes-atividade").classList.add("read-only");
      document.getElementById("btnUpdate").style.display = "none";
    } 
  }

  openDialog(element): void {
    const dialogRef = this.dialog.open(AlocacaoDialogueComponent, {
      width: '300px',
      data: {
        element
      }
    });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: this.horizontalPosition
    });
  }

  downloadArquivo(arquivo: Arquivo, atividade: Atividade): void {
    this.arquivo$ = true;
    this.pdf$ = false;
    this.aceitar$ = false;
    this.arquivoService.downloadArquivo(arquivo, atividade);
  }

  voltar(): void {
    this.router.navigate(['autorizacoes']);
  }

}
