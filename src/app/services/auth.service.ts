import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base de tu API (ajusta el puerto o dominio según corresponda)
  private apiUrl = 'http://localhost:3000/autenticacion';

  constructor(private http: HttpClient) { }

  // Método para realizar el login
  login(codigoUsuario: string, clave: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { codigoUsuario, clave });
  }

  // Guardar el token en localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Eliminar el token para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }
}
