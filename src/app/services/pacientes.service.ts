import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Paciente {
    idPaciente: number;
    nombreCompleto: string;
    email: string;
    rutaFoto?: string;
    // Agrega otros campos según tu API
}

export interface PacientesResponse {
    data: Paciente[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class PacientesService {
    // Ajusta la URL base según tu API
    private apiUrl = 'http://localhost:3000/agendamiento/pacientes';

    constructor(private http: HttpClient, private authService: AuthService) { }

    // Método para obtener pacientes con paginación. Se asume que el backend admite query params para paginación.
    getPacientes(pageIndex: number, pageSize: number): Observable<PacientesResponse> {
        const token = this.authService.getToken();  // Obtener el token de AuthService

        if (!token) {
            throw new Error('Token no encontrado');  // Si no hay token, lanzar error
        }

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`  // Añadir el token a las cabeceras
        });

        const params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PacientesResponse>(this.apiUrl, { headers, params });
    }
}
