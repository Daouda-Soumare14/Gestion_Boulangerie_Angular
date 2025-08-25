import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderResponse } from '../../models/order/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8000/api/orders'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  getHttpHeaders(): HttpHeaders {
      return new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      });
    }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, 
      { headers: this.getHttpHeaders() }
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`, 
      { headers: this.getHttpHeaders() }
    );
  }

  createOrder(order: Order): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, order, 
      { headers: this.getHttpHeaders() }
    );
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order, 
      { headers: this.getHttpHeaders() }
    );
  }

  // updateDeliveryStatus(orderId: number, status: string): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${orderId}/delivery-status`, 
  //      {delivery_status: status },
  //     { headers: this.getHttpHeaders() }
  // );
  // }

  // updateOrderStatus(orderId: number, status: string): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${orderId}/order-status`, 
  //     { order_status: status },
  //     { headers: this.getHttpHeaders() }
  // );
  // }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, 
      { headers: this.getHttpHeaders() }
    );
  }
}
