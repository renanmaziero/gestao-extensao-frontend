import { Injectable } from '@angular/core';
import { Parametrizacao } from 'src/app/models/parametrizacao.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrizacaoService {

  private baseUrl = environment.api + 'parametrizacao';

  constructor(private http: HttpClient) { }

  consultarParametrizacao(): Observable<Parametrizacao> {
    return this.http.get<Parametrizacao>(this.baseUrl + '/all'); 
  }

  updateParametrizacao(parametrizacao: Parametrizacao): Observable<any> {
    return this.http.put<any>(this.baseUrl + '/update', parametrizacao);
  }
} 
