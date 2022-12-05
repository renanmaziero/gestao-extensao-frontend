import { Injectable } from '@angular/core';
import { Parametrizacao } from 'src/app/models/parametrizacao.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrizacaoService {

  private baseUrl = environment.api + 'parametrizacao/all';

  constructor(private http: HttpClient) { }

  consultarParametrizacao(): Observable<Parametrizacao> {
    return this.http.get<Parametrizacao>(this.baseUrl); 
  }
} 
