import { Router } from '@angular/router';
import { CursoService } from './../../services/atividade/curso.service';
import { CursoExtensao } from './../../models/curso.model';
import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Convenio } from 'src/app/models/convenio.model';
import { ConvenioService } from 'src/app/services/atividade/convenio.service';
import { Regencia } from 'src/app/models/regencia.model';
import { UploadArquivoService } from 'src/app/services/upload/upload-arquivo.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Alocacao } from 'src/app/models/alocacao.model';
import { AtividadeService } from 'src/app/services/atividade/atividade.service';
import { Parametrizacao } from 'src/app/models/parametrizacao.model';
import { ParametrizacaoService } from 'src/app/services/parametrizacao/parametrizacao.service';
import { ToastrService } from 'ngx-toastr';
import { ConsultaAlocacoes } from 'src/app/models/consulta-alocacoes.model';
import { ConsultaAlocacoesService } from './../../services/consulta-alocacoes/consulta-alocacoes.service';
import { TotalHorasAprovadas } from "src/app/models/total-horas-aprovadas.model";
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {
  parametrizacao: Parametrizacao;
  totalHorasAlocacoes = new TotalHorasAprovadas();  
  consultaAlocacoes = new ConsultaAlocacoes();
  hoje = new Date();
  //minDateIni = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate());
  //maxDateIni = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate());
  minDateFim = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate()+1);
  //maxDateFim = new Date(this.hoje.getFullYear() + 2, this.hoje.getMonth(), this.hoje.getDate());
  dataEscolhida = new Date();

  @ViewChild('fileInput') fileInput: ElementRef;
  ano: number = new Date().getFullYear();

  hrSemanalConvenio: number;
  hrMensalConvenio: number;
  hrTotalMinistradaCurso: number = 0;
  hrTotalOutrasCurso: number = 0;
  hrTotalMinistradaRegencia: number = 0;
  hrTotalOutrasRegencia: number = 0;

  somaHrCurso: number = 0;
  somaHrRegencia: number = 0;
  somaHrConvenio: number = 0;
  totalHrSolicitadas: number = 0;
  tipoAtividade: string;
  msgHr: string;
  msgSucesso: string;
  msgErro: string;
  msgInfo: string;
  msgSomaZero: string = 'Defina a quantidade de horas, depois distribua nas alocações.'
  loading$ = this.loader.loading$;
  formEscolhido: FormGroup; 
  convenioForm: FormGroup;
  cursoForm: FormGroup;
  regenciaForm: FormGroup;
  convenioModel: Convenio;
  cursoModel: CursoExtensao;
  regenciaModel: Regencia;
  durationInSeconds = 5;
  selectedFiles: FileList;
  currentFile: File;
  progress = 0;
  fileAttr = 'Choose File';
  mensagemSucesso = 'Atividade submetida com sucesso!';
  alocacaoExtra = false;
  alocacaoExtra2 = false;
  alocacaoExtra3 = false;
  alocacaoExtra4 = false;
  alocacaoExtra5 = false;

  alocacao: Alocacao;
  alocacao1: Alocacao;
  alocacao2: Alocacao;
  alocacao3: Alocacao;
  alocacao4: Alocacao;
  alocacao5: Alocacao;

  extra: number[] = new Array(0,0,0);
  extra1: number[] = new Array(0,0,0);
  extra2: number[] = new Array(0,0,0);
  extra3: number[] = new Array(0,0,0);
  extra4: number[] = new Array(0,0,0);
  extra5: number[] = new Array(0,0,0);

  panelOpenState = false;

  max_hr_semanais_convenio: number;
  max_hr_mensais_convenio: number;
  max_hr_semestrais_convenio: number;
  max_hr_ministradas_curso: number;
  max_hr_semestrais_curso: number;
  max_hr_semestrais_regencia: number;

  conveniosConsulta: number = 0;
  cursosConsulta: number = 0;
  regenciasConsulta: number = 0;

  porcCursos:number = 0;
  porcConvenios:number = 0;
  porcRegencias:number = 0;

  semestreSelecionado: number = 1;
  anoSelecionado: number = this.ano;

  idLogado: string = this.tokenStorage.getUserId();

  @ViewChild(FormGroupDirective, { static: true }) form: FormGroupDirective;

  // tslint:disable-next-line: max-line-length
  constructor(private snackBar: MatSnackBar, private fb: FormBuilder, private convenioService: ConvenioService, private loader: LoaderService,
    private cursoService: CursoService, private consultaAlocacoesService: ConsultaAlocacoesService, private tokenStorage: TokenStorageService,
    private uploadService: UploadArquivoService, private atividadeService: AtividadeService, private parametrizacaoService: ParametrizacaoService, private router: Router, private toast: ToastrService) { }

  ngOnInit(): void {
    this.parametrizacao = new Parametrizacao();
    this.getParametrizacao();
    console.log('Será exibido um erro de formGroup, mas está tudo bem.');
    console.log('Isso ocorre porque o formulário é renderizado antes da inicialização das variáveis.');
    console.log('Então ele busca por algo que não existe ainda, mas é feita a inicialização posteriormente.');
  }

  updateSemanalConvenio(horas: any) {
    this.hrSemanalConvenio = parseFloat(((horas.target.value) / 4).toFixed(0));
    this.somaHrConvenio = this.hrMensalConvenio;
    this.confereSoma();
  }

  updateMensalConvenio(horas: any) {
    this.hrMensalConvenio = parseFloat(((horas.target.value) * 4).toFixed(0));
    this.somaHrConvenio = this.hrMensalConvenio;
    this.confereSoma();
  }

  updateSomaHrCurso(){
    this.somaHrCurso = this.hrTotalMinistradaCurso + this.hrTotalOutrasCurso;
    this.confereSoma();
  }

  updateSomaHrRegencia(){
    this.somaHrRegencia = this.hrTotalMinistradaRegencia + this.hrTotalOutrasRegencia;
    this.confereSoma();
  }

  updateMsg(){
    this.msgSucesso = 'Horas informadas batem com o total de ' + this.msgHr + 'h.';
    this.msgErro = 'Total de horas informadas ultrapassam ' + this.msgHr + 'h.';
    this.msgInfo = 'Você precisa distribuir ' + this.msgHr + 'h.';
  }

  consultaHrAlocacoes(extra: number) {
    this.consultaAlocacoesService.consultarAlocacoes(parseInt(this.idLogado), this.semestreSelecionado, this.anoSelecionado).subscribe(
      (data) => {
        this.consultaAlocacoes = data;
        this.conveniosConsulta = this.consultaAlocacoes[0];
        this.cursosConsulta = this.consultaAlocacoes[1];
        this.regenciasConsulta = this.consultaAlocacoes[2];
        this.porcCursos = parseFloat(((this.cursosConsulta/this.max_hr_semestrais_curso)*100).toFixed(2));
        this.porcRegencias = parseFloat(((this.regenciasConsulta/this.max_hr_semestrais_regencia)*100).toFixed(2));
        this.porcConvenios = parseFloat(((this.conveniosConsulta/this.max_hr_semestrais_convenio)*100).toFixed(2));

        //horas disponiveis 
        switch (extra) {
          case 0:
            this.extra[0] = this.conveniosConsulta;
            this.extra[1] = this.cursosConsulta;
            this.extra[2] = this.regenciasConsulta;
            
            break;
            
          case 1:
            this.extra1[0] = this.conveniosConsulta;
            this.extra1[1] = this.cursosConsulta;
            this.extra1[2] = this.regenciasConsulta;        
            break;    
          
          case 2:
            this.extra2[0] = this.conveniosConsulta;
            this.extra2[1] = this.cursosConsulta;
            this.extra2[2] = this.regenciasConsulta;       
            break;
          
          case 3:
            this.extra3[0] = this.conveniosConsulta;
            this.extra3[1] = this.cursosConsulta;
            this.extra3[2] = this.regenciasConsulta;        
            break;
            
          case 4:
            this.extra4[0] = this.conveniosConsulta;
            this.extra4[1] = this.cursosConsulta;
            this.extra4[2] = this.regenciasConsulta;        
            break;
    
          case 5:
            this.extra5[0] = this.conveniosConsulta;
            this.extra5[1] = this.cursosConsulta;
            this.extra5[2] = this.regenciasConsulta;        
            break;
        }

      },
      (erro) => {
        console.log(erro);
      }
    );
  }
 
  confereSoma() {
    if (this.tipoAtividade == 'Convênios') {
      this.totalHrSolicitadas = this.convenioForm.get('horasSolicitadas').value + this.convenioForm.get('horasSolicitadas1').value + this.convenioForm.get('horasSolicitadas2').value + this.convenioForm.get('horasSolicitadas3').value + this.convenioForm.get('horasSolicitadas4').value + this.convenioForm.get('horasSolicitadas5').value;
      this.msgHr = this.somaHrConvenio.toString();
      this.updateMsg();
      if (this.totalHrSolicitadas > this.somaHrConvenio && this.somaHrConvenio > 0) {this.toast.error(this.msgErro);}
      if (this.totalHrSolicitadas == this.somaHrConvenio && this.totalHrSolicitadas > 0) {this.toast.success(this.msgSucesso);}
      if (this.totalHrSolicitadas < this.somaHrConvenio) {this.toast.info(this.msgInfo);}
      if(this.somaHrConvenio == 0){this.toast.info(this.msgSomaZero);}
    }

    if (this.tipoAtividade == 'Cursos') {
      this.totalHrSolicitadas = this.cursoForm.get('horasSolicitadas').value + this.cursoForm.get('horasSolicitadas1').value + this.cursoForm.get('horasSolicitadas2').value + this.cursoForm.get('horasSolicitadas3').value + this.cursoForm.get('horasSolicitadas4').value + this.cursoForm.get('horasSolicitadas5').value;
      this.msgHr = this.somaHrCurso.toString();
      this.updateMsg();
      if (this.totalHrSolicitadas > this.somaHrCurso && this.somaHrCurso > 0) {this.toast.error(this.msgErro);}
      if (this.totalHrSolicitadas == this.somaHrCurso && this.totalHrSolicitadas > 0) {this.toast.success(this.msgSucesso);}
      if (this.totalHrSolicitadas < this.somaHrCurso) {this.toast.info(this.msgInfo);}
      if(this.somaHrCurso == 0){this.toast.info(this.msgSomaZero);}
    }

    if (this.tipoAtividade == 'Regência Concomitante') {
      this.totalHrSolicitadas = this.regenciaForm.get('horasSolicitadas').value + this.regenciaForm.get('horasSolicitadas1').value + this.regenciaForm.get('horasSolicitadas2').value + this.regenciaForm.get('horasSolicitadas3').value + this.regenciaForm.get('horasSolicitadas4').value + this.regenciaForm.get('horasSolicitadas5').value;
      this.msgHr = this.somaHrRegencia.toString();
      this.updateMsg();
      if (this.totalHrSolicitadas > this.somaHrRegencia && this.somaHrRegencia > 0) {this.toast.error(this.msgErro);}
      if (this.totalHrSolicitadas == this.somaHrRegencia && this.totalHrSolicitadas > 0) {this.toast.success(this.msgSucesso);}
      if (this.totalHrSolicitadas < this.somaHrRegencia) {this.toast.info(this.msgInfo);}
      if(this.somaHrRegencia == 0){this.toast.info(this.msgSomaZero);}
    }
  }

  resetHrExtra(extra: number) {
    //this.regenciaForm.markAllAsTouched()
    this.convenioForm.get('horasSolicitadas' + extra).setValue(0);
    this.cursoForm.get('horasSolicitadas' + extra).setValue(0);
    this.regenciaForm.get('horasSolicitadas' + extra).setValue(0);
    this.convenioForm.get('semestre' + extra).setValue('1');
    this.cursoForm.get('semestre' + extra).setValue('1');
    this.regenciaForm.get('semestre' + extra).setValue('1');
    this.convenioForm.get('ano' + extra).setValue(this.ano.toString());
    this.cursoForm.get('ano' + extra).setValue(this.ano.toString());
    this.regenciaForm.get('ano' + extra).setValue(this.ano.toString());
    this.confereSoma();
  }

  hrRestantes(extra: number){
    if (this.tipoAtividade == 'Convênios') {this.formEscolhido = this.convenioForm;}
    if (this.tipoAtividade == 'Cursos') {this.formEscolhido = this.cursoForm;}
    if (this.tipoAtividade == 'Regência Concomitante') {this.formEscolhido = this.regenciaForm;}

    switch (extra) {
      case 0:
        this.semestreSelecionado = this.formEscolhido.get('semestre').value;
        this.anoSelecionado = this.formEscolhido.get('ano').value;
        break;
        
      case 1:
        this.semestreSelecionado = this.formEscolhido.get('semestre' + extra).value;
        this.anoSelecionado = this.formEscolhido.get('ano' + extra).value;
        break;    
      
      case 2:
        this.semestreSelecionado = this.formEscolhido.get('semestre' + extra).value;
        this.anoSelecionado = this.formEscolhido.get('ano' + extra).value;
        break;
      
      case 3:
        this.semestreSelecionado = this.formEscolhido.get('semestre' + extra).value;
        this.anoSelecionado = this.formEscolhido.get('ano' + extra).value;
        break;
        
      case 4:
        this.semestreSelecionado = this.formEscolhido.get('semestre' + extra).value;
        this.anoSelecionado = this.formEscolhido.get('ano' + extra).value;
        break;

      case 5:
        this.semestreSelecionado = this.formEscolhido.get('semestre' + extra).value;
        this.anoSelecionado = this.formEscolhido.get('ano' + extra).value;
        break;
    }
    
    this.consultaHrAlocacoes(extra);    
    
  }

  definetipoAtividade(tipo: string): void {
    this.tipoAtividade = tipo;
    this.toast.success(tipo);
    if (this.tipoAtividade == 'Convênios') {this.cursoForm.reset(); this.regenciaForm.reset();}
    if (this.tipoAtividade == 'Cursos') {this.convenioForm.reset(); this.regenciaForm.reset();}
    if (this.tipoAtividade == 'Regência Concomitante') {this.convenioForm.reset(); this.cursoForm.reset();}
  }

  setRequired(){
    if (this.cursoForm.get('participacao').value == 'COORDENACAO'){
      this.cursoForm.get('totalHorasMinistradas').setValidators([Validators.max(this.max_hr_ministradas_curso)]);
      this.cursoForm.get('totalHorasMinistradas').updateValueAndValidity();
    } else {
      this.cursoForm.get('totalHorasMinistradas').setValidators([Validators.required, Validators.max(this.max_hr_ministradas_curso), Validators.min(1)]);
      this.cursoForm.get('totalHorasMinistradas').updateValueAndValidity();
    }
  }

  createForm(): void {
    this.convenioForm = this.fb.group({
      instituicao: [null, Validators.required],
      projeto: [null, Validators.required],
      coordenador: [null],
      horaSemanal: [null, Validators.max(this.max_hr_semanais_convenio)],
      horaMensal: [null, Validators.max(this.max_hr_mensais_convenio)],
      descricao: [null, Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      valorBruto: [null, Validators.required],
      observacao: [null],
      ano: [null, Validators.required],
      semestre: [null, Validators.required],
      horasSolicitadas: [null, [Validators.max(this.max_hr_semestrais_convenio), Validators.required]],
      ano1: [null],
      semestre1: [null],
      horasSolicitadas1: [null, Validators.max(this.max_hr_semestrais_convenio)],
      ano2: [null],
      semestre2: [null],
      horasSolicitadas2: [null, Validators.max(this.max_hr_semestrais_convenio)],
      ano3: [null],
      semestre3: [null],
      horasSolicitadas3: [null, Validators.max(this.max_hr_semestrais_convenio)],
      ano4: [null],
      semestre4: [null],
      horasSolicitadas4: [null, Validators.max(this.max_hr_semestrais_convenio)],
      ano5: [null],
      semestre5: [null],
      horasSolicitadas5: [null, Validators.max(this.max_hr_semestrais_convenio)],
      tipoAtividadeSimultanea: [null, Validators.required],
      urgente: ['']
    });

    this.cursoForm = this.fb.group({
      instituicaoVinculada: [null, Validators.required],
      nomeCurso: [null, Validators.required],
      coordenador: [null],
      participacao: [null, Validators.required],
      disciplina: [null],
      totalHorasMinistradas: [null, Validators.max(this.max_hr_ministradas_curso)],
      valorBrutoHora: [null],
      valorBrutoTotal: [null],
      totalHorasOutrasAtividades: [null, Validators.max(this.max_hr_ministradas_curso)],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      observacao: [null],
      ano: [null, Validators.required],
      semestre: [null, Validators.required],
      horasSolicitadas: [null, [Validators.max(this.max_hr_semestrais_curso), Validators.required]],
      ano1: [null],
      semestre1: [null],
      horasSolicitadas1: [null, Validators.max(this.max_hr_semestrais_curso)],
      ano2: [null],
      semestre2: [null],
      horasSolicitadas2: [null, Validators.max(this.max_hr_semestrais_curso)],
      ano3: [null],
      semestre3: [null],
      horasSolicitadas3: [null, Validators.max(this.max_hr_semestrais_curso)],
      ano4: [null],
      semestre4: [null],
      horasSolicitadas4: [null, Validators.max(this.max_hr_semestrais_curso)],
      ano5: [null],
      semestre5: [null],
      horasSolicitadas5: [null, Validators.max(this.max_hr_semestrais_curso)],
      urgente: ['']
    });

    this.regenciaForm = this.fb.group({
      nivel: [null, Validators.required],
      curso: [null, Validators.required],
      coordenador: [null],
      disciplinaParticipacao: [null],
      totalHorasMinistradas: [null],
      totalHorasOutrasAtividades: [null, Validators.required],
      valorBrutoHora: [null, Validators.required],
      valorBrutoTotal: [null, Validators.required],
      instituicao: [null, Validators.required],
      diasTrabalhadosUnicamp: [null, Validators.required],
      diasTrabalhadosOutraInstituicao: [null, Validators.required],
      responsavel: [null, Validators.required],
      unicoDocente: [null, Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      observacao: [null],
      ano: [null, Validators.required],
      semestre: [null, Validators.required],
      horasSolicitadas: [null, [Validators.max(this.max_hr_semestrais_regencia), Validators.required]],
      ano1: [null],
      semestre1: [null],
      horasSolicitadas1: [null, Validators.max(this.max_hr_semestrais_regencia)],
      ano2: [null],
      semestre2: [null],
      horasSolicitadas2: [null, Validators.max(this.max_hr_semestrais_regencia)],
      ano3: [null],
      semestre3: [null],
      horasSolicitadas3: [null, Validators.max(this.max_hr_semestrais_regencia)],
      ano4: [null],
      semestre4: [null],
      horasSolicitadas4: [null, Validators.max(this.max_hr_semestrais_regencia)],
      ano5: [null],
      semestre5: [null],
      horasSolicitadas5: [null, Validators.max(this.max_hr_semestrais_regencia)],
      urgente: ['']
    });
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

        this.createForm();

      },
      (erro) => {
        console.log(erro);
      }
    );
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  submeterConvenio(): void {
    this.convenioModel = new Convenio();
    this.convenioModel.coordenador = this.convenioForm.get('coordenador').value;
    this.convenioModel.instituicao = this.convenioForm.get('instituicao').value;
    this.convenioModel.descricao = this.convenioForm.get('descricao').value;
    this.convenioModel.horaMensal = this.convenioForm.get('horaMensal').value;
    this.convenioModel.horaSemanal = this.convenioForm.get('horaSemanal').value;
    this.convenioModel.projeto = this.convenioForm.get('projeto').value;
    this.convenioModel.valorBruto = this.convenioForm.get('valorBruto').value;
    this.convenioModel.dataInicio = this.convenioForm.get('dataInicio').value;
    this.convenioModel.dataFim = this.convenioForm.get('dataFim').value;
    this.convenioModel.observacao = this.convenioForm.get('observacao').value;
    this.convenioModel.tipoAtividadeSimultanea = this.convenioForm.get('tipoAtividadeSimultanea').value;
    this.convenioModel.urgente = this.convenioForm.get('urgente').value;
    this.convenioModel.alocacoes = [];
    this.alocacao = new Alocacao();
    this.alocacao.ano = this.convenioForm.get('ano').value;
    this.alocacao.semestre = this.convenioForm.get('semestre').value;
    this.alocacao.horasSolicitadas = this.convenioForm.get('horasSolicitadas').value;
    this.convenioModel.alocacoes.push(this.alocacao);

    if (this.alocacaoExtra) {
      this.alocacao1 = new Alocacao();
      this.alocacao1.ano = this.convenioForm.get('ano1').value;
      this.alocacao1.semestre = this.convenioForm.get('semestre1').value;
      this.alocacao1.horasSolicitadas = this.convenioForm.get('horasSolicitadas1').value;
      this.convenioModel.alocacoes.push(this.alocacao1);
    }

    if (this.alocacaoExtra2) {
      this.alocacao2 = new Alocacao();
      this.alocacao2.ano = this.convenioForm.get('ano2').value;
      this.alocacao2.semestre = this.convenioForm.get('semestre2').value;
      this.alocacao2.horasSolicitadas = this.convenioForm.get('horasSolicitadas2').value;
      this.convenioModel.alocacoes.push(this.alocacao2);
    }

    if (this.alocacaoExtra3) {
      this.alocacao3 = new Alocacao();
      this.alocacao3.ano = this.convenioForm.get('ano3').value;
      this.alocacao3.semestre = this.convenioForm.get('semestre3').value;
      this.alocacao3.horasSolicitadas = this.convenioForm.get('horasSolicitadas3').value;
      this.convenioModel.alocacoes.push(this.alocacao3);
    }

    if (this.alocacaoExtra4) {
      this.alocacao4 = new Alocacao();
      this.alocacao4.ano = this.convenioForm.get('ano4').value;
      this.alocacao4.semestre = this.convenioForm.get('semestre4').value;
      this.alocacao4.horasSolicitadas = this.convenioForm.get('horasSolicitadas4').value;
      this.convenioModel.alocacoes.push(this.alocacao4);
    }

    if (this.alocacaoExtra5) {
      this.alocacao5 = new Alocacao();
      this.alocacao5.ano = this.convenioForm.get('ano5').value;
      this.alocacao5.semestre = this.convenioForm.get('semestre5').value;
      this.alocacao5.horasSolicitadas = this.convenioForm.get('horasSolicitadas5').value;
      this.convenioModel.alocacoes.push(this.alocacao5);
    }

    this.convenioService.salvarConvenio(this.convenioModel).subscribe(
      data => {
        if (this.selectedFiles != null) {
          this.upload(data.id);
        }
        this.openSnackBar(this.mensagemSucesso, 'OK');
        this.router.navigate(['/autorizacoes']);
      },
      erro => {
        //console.log(erro);
      }
    );
  }

  submeterCurso(): void {
    this.cursoModel = new CursoExtensao();
    this.cursoModel.coordenador = this.cursoForm.get('coordenador').value;
    this.cursoModel.nomeCurso = this.cursoForm.get('nomeCurso').value;
    this.cursoModel.participacao = this.cursoForm.get('participacao').value;
    this.cursoModel.observacao = this.cursoForm.get('observacao').value;
    this.cursoModel.disciplinas = this.cursoForm.get('disciplina').value;
    this.cursoModel.totalHorasMinistradas = this.cursoForm.get('totalHorasMinistradas').value;
    this.cursoModel.totalHorasOutrasAtividades = this.cursoForm.get('totalHorasOutrasAtividades').value;
    this.cursoModel.valorBrutoHora = this.cursoForm.get('valorBrutoHora').value;
    this.cursoModel.valorBrutoTotal = this.cursoForm.get('valorBrutoTotal').value;
    this.cursoModel.dataInicio = this.cursoForm.get('dataInicio').value;
    this.cursoModel.dataFim = this.cursoForm.get('dataFim').value;
    this.cursoModel.instituicaoVinculada = this.cursoForm.get('instituicaoVinculada').value;
    this.cursoModel.urgente = this.cursoForm.get('urgente').value;

    this.cursoModel.alocacoes = [];

    this.alocacao = new Alocacao();
    this.alocacao.ano = this.cursoForm.get('ano').value;
    this.alocacao.semestre = this.cursoForm.get('semestre').value;
    this.alocacao.horasSolicitadas = this.cursoForm.get('horasSolicitadas').value;
    this.cursoModel.alocacoes.push(this.alocacao);

    if (this.alocacaoExtra) {
      this.alocacao1 = new Alocacao();
      this.alocacao1.ano = this.cursoForm.get('ano1').value;
      this.alocacao1.semestre = this.cursoForm.get('semestre1').value;
      this.alocacao1.horasSolicitadas = this.cursoForm.get('horasSolicitadas1').value;
      this.cursoModel.alocacoes.push(this.alocacao1);
    }

    if (this.alocacaoExtra2) {
      this.alocacao2 = new Alocacao();
      this.alocacao2.ano = this.cursoForm.get('ano2').value;
      this.alocacao2.semestre = this.cursoForm.get('semestre2').value;
      this.alocacao2.horasSolicitadas = this.cursoForm.get('horasSolicitadas2').value;
      this.cursoModel.alocacoes.push(this.alocacao2);
    }

    if (this.alocacaoExtra3) {
      this.alocacao3 = new Alocacao();
      this.alocacao3.ano = this.cursoForm.get('ano3').value;
      this.alocacao3.semestre = this.cursoForm.get('semestre3').value;
      this.alocacao3.horasSolicitadas = this.cursoForm.get('horasSolicitadas3').value;
      this.cursoModel.alocacoes.push(this.alocacao3);
    }

    if (this.alocacaoExtra4) {
      this.alocacao4 = new Alocacao();
      this.alocacao4.ano = this.cursoForm.get('ano4').value;
      this.alocacao4.semestre = this.cursoForm.get('semestre4').value;
      this.alocacao4.horasSolicitadas = this.cursoForm.get('horasSolicitadas4').value;
      this.cursoModel.alocacoes.push(this.alocacao4);
    }

    if (this.alocacaoExtra5) {
      this.alocacao5 = new Alocacao();
      this.alocacao5.ano = this.cursoForm.get('ano5').value;
      this.alocacao5.semestre = this.cursoForm.get('semestre5').value;
      this.alocacao5.horasSolicitadas = this.cursoForm.get('horasSolicitadas5').value;
      this.cursoModel.alocacoes.push(this.alocacao5);
    }

    this.cursoService.salvarCurso(this.cursoModel).subscribe(
      data => {
        if (this.selectedFiles != null) {
          this.upload(data.id);
        }
        this.openSnackBar(this.mensagemSucesso, 'OK');
        this.router.navigate(['/autorizacoes']);
      },
      erro => {
        //console.log(erro);
      }
    );
  }

  submeterRegencia(): void {
    this.regenciaModel = new Regencia();
    this.regenciaModel.coordenador = this.regenciaForm.get('coordenador').value;
    this.regenciaModel.nivel = this.regenciaForm.get('nivel').value;
    this.regenciaModel.curso = this.regenciaForm.get('curso').value;
    this.regenciaModel.observacao = this.regenciaForm.get('observacao').value;
    this.regenciaModel.disciplinaParticipacao = this.regenciaForm.get('disciplinaParticipacao').value;
    this.regenciaModel.totalHorasMinistradas = this.regenciaForm.get('totalHorasMinistradas').value;
    this.regenciaModel.totalHorasOutrasAtividades = this.regenciaForm.get('totalHorasOutrasAtividades').value;
    this.regenciaModel.valorBrutoHora = this.regenciaForm.get('valorBrutoHora').value;
    this.regenciaModel.valorBrutoTotal = this.regenciaForm.get('valorBrutoTotal').value;
    this.regenciaModel.dataInicio = this.regenciaForm.get('dataInicio').value;
    this.regenciaModel.dataFim = this.regenciaForm.get('dataFim').value;
    this.regenciaModel.instituicao = this.regenciaForm.get('instituicao').value;
    this.regenciaModel.diasTrabalhadosOutraInstituicao = this.regenciaForm.get('diasTrabalhadosOutraInstituicao').value;
    this.regenciaModel.diasTrabalhadosUnicamp = this.regenciaForm.get('diasTrabalhadosUnicamp').value;
    this.regenciaModel.responsavel = this.regenciaForm.get('responsavel').value;
    this.regenciaModel.unicoDocente = this.regenciaForm.get('unicoDocente').value;
    this.regenciaModel.urgente = this.regenciaForm.get('urgente').value;
    this.regenciaModel.alocacoes = [];

    this.alocacao = new Alocacao();
    this.alocacao.ano = this.regenciaForm.get('ano').value;
    this.alocacao.semestre = this.regenciaForm.get('semestre').value;
    this.alocacao.horasSolicitadas = this.regenciaForm.get('horasSolicitadas').value;
    this.regenciaModel.alocacoes.push(this.alocacao);

    if (this.alocacaoExtra) {
      this.alocacao1 = new Alocacao();
      this.alocacao1.ano = this.regenciaForm.get('ano1').value;
      this.alocacao1.semestre = this.regenciaForm.get('semestre1').value;
      this.alocacao1.horasSolicitadas = this.regenciaForm.get('horasSolicitadas1').value;
      this.regenciaModel.alocacoes.push(this.alocacao1);
    }

    if (this.alocacaoExtra2) {
      this.alocacao2 = new Alocacao();
      this.alocacao2.ano = this.regenciaForm.get('ano2').value;
      this.alocacao2.semestre = this.regenciaForm.get('semestre2').value;
      this.alocacao2.horasSolicitadas = this.regenciaForm.get('horasSolicitadas2').value;
      this.regenciaModel.alocacoes.push(this.alocacao2);
    }

    if (this.alocacaoExtra3) {
      this.alocacao3 = new Alocacao();
      this.alocacao3.ano = this.regenciaForm.get('ano3').value;
      this.alocacao3.semestre = this.regenciaForm.get('semestre3').value;
      this.alocacao3.horasSolicitadas = this.regenciaForm.get('horasSolicitadas3').value;
      this.regenciaModel.alocacoes.push(this.alocacao3);
    }

    if (this.alocacaoExtra4) {
      this.alocacao4 = new Alocacao();
      this.alocacao4.ano = this.regenciaForm.get('ano4').value;
      this.alocacao4.semestre = this.regenciaForm.get('semestre4').value;
      this.alocacao4.horasSolicitadas = this.regenciaForm.get('horasSolicitadas4').value;
      this.regenciaModel.alocacoes.push(this.alocacao4);
    }

    if (this.alocacaoExtra5) {
      this.alocacao5 = new Alocacao();
      this.alocacao5.ano = this.regenciaForm.get('ano5').value;
      this.alocacao5.semestre = this.regenciaForm.get('semestre5').value;
      this.alocacao5.horasSolicitadas = this.regenciaForm.get('horasSolicitadas5').value;
      this.regenciaModel.alocacoes.push(this.alocacao5);
    }

    this.atividadeService.salvarRegencia(this.regenciaModel).subscribe(
      data => {
        if (this.selectedFiles != null) {
          this.upload(data.id);
        }
        this.openSnackBar(this.mensagemSucesso, 'OK');
        this.router.navigate(['/autorizacoes']);
      },
      erro => {
        this.openSnackBar('Erro ao submeter atividade', 'OK');
        //console.log(erro);
      }
    );
  }

  selecionarArquivo(event): void {
    this.selectedFiles = event.target.files;
  }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: File) => {
        this.fileAttr += file.name + ' - ';
      });

      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          let imgBase64Path = e.target.result;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);

      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = "";
    } else {
      this.fileAttr = 'Choose File';
    }
  }

  upload(atividadeId: number): void {
    this.progress = 0;

    this.currentFile = this.selectedFiles.item(0);
    this.uploadService.upload(this.currentFile, atividadeId).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        }
      },
      err => {
        this.progress = 0;
        this.currentFile = undefined;
      });
    this.selectedFiles = undefined;
  }
}
