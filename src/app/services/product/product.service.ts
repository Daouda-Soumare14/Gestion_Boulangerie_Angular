import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private apiUrl = 'http://localhost:8000/api/products';
  private apiUrlHero = 'http://localhost:8000/api/hero-products';

  constructor(private http: HttpClient) { }

  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    })
  }


  getProducts(filters: any, page: number = 1): Observable<Product[]> {
    let params = new HttpParams().set('page', page.toString()); // set('page', page.toString() pour dire qu'on va paginer par page)

    if (filters.search) {
      params = params.set('search', filters.search)
    }

    if (filters.category_id) {
      params = params.set('category_id', filters.category_id.toString())
    }

    if (filters.min_price) {
      params = params.set('min_price', filters.min_price.toString())
    }

    if (filters.max_price) {
      params = params.set('max_price', filters.max_price.toString())
    }

    return this.http.get<Product[]>(this.apiUrl, {
      headers: this.getHttpHeaders(),
      params: params
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, {
      headers: this.getHttpHeaders()
    });
  }


  createProduct(data: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data, {
      headers: this.getHttpHeaders()
    });
  }

  editProduct(id: number, data: FormData): Observable<Product> {
    data.append('_method', 'PUT');
    return this.http.post<Product>(`${this.apiUrl}/${id}`, data, {
      headers: this.getHttpHeaders()
    });
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`, {
      headers: this.getHttpHeaders()
    });
  }

  getHeroProducts() {
    return this.http.get<Product[]>(this.apiUrlHero);
  }
}
