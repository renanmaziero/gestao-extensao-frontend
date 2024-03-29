import { environment } from './../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from './../../models/dashboard.model';
import { DashboardService } from './../../services/dashboard/dashboard.service';
import { Autorizacao } from './../../models/autorizacao.model';
import { Atividade } from './../../models/atividade.model';
import { Docente } from './../../models/docente.model';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { TokenStorageService } from 'src/app/core/auth/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  dashboard: Dashboard = new Dashboard();
  errorMsg: string;
  admin: boolean;
  perfil: string[] = [];

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [

          { title: 'Autorizações', cols: 1, rows: 1 }

        ];
      }

      return [

        { title: 'Autorizações', cols: 1, rows: 1 }

      ];
    })
  );

   filtraPendente(): void {
    this.router.navigate(['/autorizacoes/filtro/pendente']);    
  }

  constructor(private breakpointObserver: BreakpointObserver, private dashboardService: DashboardService, private toast: ToastrService, private router: Router,private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    this.perfil = this.tokenStorage.getAuthorities();
    if(this.perfil.includes('ROLE_ADMIN')){
      this.admin = true;
    } else {this.admin = false;}
    
    this.getDadosDashboard();
  }

  public getDadosDashboard(): void {
    this.dashboardService.getDadosDashboard().subscribe(
      data => {
        //console.log(data);
        this.dashboard = data;
      },
      error => {
        //console.log(error);
        this.toast.error('Acesso negado.');
        window.location.replace(environment.localhost + 'criar-atividade');
      }
    );
  }
}
