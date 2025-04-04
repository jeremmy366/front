import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../interface/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de tu API (ajusta el puerto o dominio según corresponda)
  private apiUrl = 'http://localhost:3000/autenticacion';

  constructor(private http: HttpClient) { }

  // Método para realizar el login
  login(codigoUsuario: string, clave: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { codigoUsuario, clave }).pipe(
      tap((res) => {
        if (res.token) {
          this.setToken(res.token);
        }
      })
    );
  }

  // Guardar el token en localStorage
  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
      console.log('Token guardado:', token);
    }
  }

  // Obtener el token
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Eliminar el token para cerrar sesión
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
  }
}
