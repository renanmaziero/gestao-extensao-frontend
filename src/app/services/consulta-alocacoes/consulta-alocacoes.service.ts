import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TotalHorasAprovadas } from 'src/app/models/total-horas-aprovadas.model';
import { ConsultaAlocacoes } from 'src/app/models/consulta-alocacoes.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaAlocacoesService {

  private baseUrl = environment.api + 'alocacao';

  constructor(private http: HttpClient) {}

  totalHorasAprovadas(docenteId: number): Observable<TotalHorasAprovadas>{
    return this.http.get<TotalHorasAprovadas>(this.baseUrl + '/total-horas-aprovadas/' + docenteId)
  }

  consultarAlocacoes(docenteId: number, semestre: number, ano: number): Observable<ConsultaAlocacoes>{
    console.log(this.baseUrl + '/consultar-alocacoes/' + docenteId + '/' + semestre + '/' + ano);
    return this.http.get<ConsultaAlocacoes>(this.baseUrl + '/consultar-alocacoes/' + docenteId + '/' + semestre + '/' + ano)
  }
}
