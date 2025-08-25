import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pack } from '../../models/pack/pack';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  private apiUrl = 'http://localhost:8000/api/packs';

  constructor(private http: HttpClient) {}

  getPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(this.apiUrl);
  }

  getPack(id: number): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/${id}`);
  }

  createPack(pack: Pack): Observable<Pack> {
    return this.http.post<Pack>(this.apiUrl, pack);
  }

  updatePack(id: number, pack: Pack): Observable<Pack> {
    return this.http.put<Pack>(`${this.apiUrl}/${id}`, pack);
  }

  deletePack(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
