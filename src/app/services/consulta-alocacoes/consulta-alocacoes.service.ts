import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConsultaAlocacoes } from 'src/app/models/consulta-alocacoes.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaAlocacoesService {

  private baseUrl = environment.api + 'alocacao';

  constructor(private http: HttpClient) {}

  consultarAlocacoes(docenteId: number): Observable<ConsultaAlocacoes>{
    console.log(this.baseUrl + '/consultar/' + docenteId);
    return this.http.get<ConsultaAlocacoes>(this.baseUrl + '/consultar/' + docenteId)
  }
}
