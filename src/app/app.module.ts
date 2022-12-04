import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularValidateBrLibModule } from 'angular-validate-br';
import { TextMaskModule } from 'angular2-text-mask';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlocacaoComponentComponent } from './components/alocacoes/alocacao-component/alocacao-component.component';
import { AlocacaoDialogueComponent } from './components/alocacoes/alocacao-dialogue/alocacao-dialogue.component';
import { ConvenioComponent } from './components/atividades/convenio/convenio.component';
import { CursoExtensaoComponent } from './components/atividades/curso-extensao/curso-extensao.component';
import { RegenciaComponent } from './components/atividades/regencia/regencia.component';
import {
  DevolucaoDialogueComponent,
} from './components/autorizacao/autorizacao-detalhes/devolucao-dialogue/devolucao-dialogue.component';
import { AutorizacaoComponent } from './components/autorizacao/autorizacao.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { ConfiguracaoComponent } from './components/configuracao/configuracao.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocenteDetalheComponent } from './components/docente/docente-detalhe/docente-detalhe.component';
import { DocenteComponent } from './components/docente/docente.component';
import { ActivityFormComponent } from './components/formulario/activity-form.component';
import { LoginComponent } from './components/login/login.component';
import { RelatorioComponent, RelatorioDocenteSearchDialogueComponent } from './components/relatorio/relatorio.component';
import { ResetSenhaComponent } from './components/senha/reset-senha/reset-senha.component';
import { UpdateSenhaComponent } from './components/senha/update/update-senha/update-senha.component';
import { AuthGuardService } from './core/auth/auth-guard.service';
import { httpInterceptorProviders } from './core/auth/auth-interceptor';
import { MaterialModule } from './material/material.module';
import { DocenteService } from './services/docente/docente.service';
import { RelatorioService } from './services/relatorio/relatorio.service';
import { ConfirmacaoDialogueComponent } from './shared/confirmacao-dialogue/confirmacao-dialogue.component';
import { PermissaoPipe } from './shared/pipes/permissao.pipe';
import { ParametrizacaoComponent } from './components/parametrizacao/parametrizacao.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ActivityFormComponent,
    DocenteComponent,
    RelatorioComponent,
    LoginComponent,
    CadastroComponent,
    AutorizacaoComponent,
    ConfiguracaoComponent,
    RelatorioDocenteSearchDialogueComponent,
    ConfirmacaoDialogueComponent,
    DevolucaoDialogueComponent,
    DocenteDetalheComponent,
    ResetSenhaComponent,
    UpdateSenhaComponent,
    ConvenioComponent,
    CursoExtensaoComponent,
    RegenciaComponent,
    AlocacaoComponentComponent,
    AlocacaoDialogueComponent,
    PermissaoPipe,
    ParametrizacaoComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HammerModule,
    TextMaskModule,
    AngularValidateBrLibModule,
  ],
  exports: [MatIconModule],
  providers: [
    AuthGuardService,
    httpInterceptorProviders,
    RelatorioService,
    DocenteService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
