import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../../models/category/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8000/api/categories';

  constructor(private http: HttpClient) { }

  getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    });
  }

  getCategories(): Observable<Category[]> {
      return this.http.get<Category[]>(this.apiUrl, {
        headers: this.getHttpHeaders()
      });
  }
}
