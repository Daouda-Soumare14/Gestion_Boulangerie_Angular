import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pack } from '../../models/pack/pack';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  private apiUrl = 'http://localhost:8000/api/packs';

  constructor(private http: HttpClient) { }

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    })
  }

  getPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(this.apiUrl, 
      { headers: this.getHttpHeaders() }
    );
  }

  getPack(id: number): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/${id}`,
      { headers: this.getHttpHeaders() }
    );
  }

  createPack(pack: Pack): Observable<Pack> {
    return this.http.post<Pack>(this.apiUrl, pack,
      { headers: this.getHttpHeaders() }
    );
  }

  updatePack(id: number, pack: Pack): Observable<Pack> {
    return this.http.put<Pack>(`${this.apiUrl}/${id}`, pack,
      { headers: this.getHttpHeaders() }
    );
  }

  deletePack(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,
      { headers: this.getHttpHeaders() }
    );
  }
}
