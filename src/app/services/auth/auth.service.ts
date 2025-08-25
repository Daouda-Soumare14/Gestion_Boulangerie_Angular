import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../../models/auth/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:8000/api/'

  constructor(private http: HttpClient) { }

  public currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  register(data: User) {
    return this.http.post<User>(`${this.apiUrl}register`, data)
  }

  login(loginForm: FormGroup) {
    return this.http.post<User>(`${this.apiUrl}login`, loginForm).pipe(
      tap({
        next: (res) => {
          console.log('Login API response:', res);
          if (res.token, res.data) {
            localStorage.setItem('auth_token', res.token);
            // localStorage.setItem('user_role', res.role);
            localStorage.setItem('current_user', JSON.stringify(res.data)); // stocke user
            this.currentUserSubject.next(res.data);
          } else {
            alert('token ou role manquant')
          }
        }, error: () => {
          alert('echec de la connexion.')
        }
      })
    )
  }

  logout() {
    return this.http.post(`${this.apiUrl}logout`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }).pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('current_user'); // supprime user
        this.currentUserSubject.next(null); 
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token'); // true si connecter
  }


  me() {
    return this.http.get<any>(`${this.apiUrl}me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }).pipe(
      tap(res => {
        if (res.role) {
          localStorage.setItem('user_role', res.role);
        }
      })
    );
  }


  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}

