import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Promotion } from '../../models/promotion/promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private apiUrl = 'http://localhost:8000/api/promotions';

  constructor(private http: HttpClient) { }

  private getHttpHeaders(): HttpHeaders {
      return new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      })
    }

  // getPromotions(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl
  //     // { headers: this.getHttpHeaders() }
  //   );
  // }


  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  createPromotion(data: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, data);
  }

  updatePromotion(id: number, data: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${id}`, data);
  }

  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
