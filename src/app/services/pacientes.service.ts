import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export interface Paciente {
    idPaciente: number;
    nombreCompleto: string;
    email: string;
    rutaFoto?: string;
    // Otros campos según tu API
}

export interface PacientesResponse {
    rows: Paciente[];
    totalRows: number;
}

@Injectable({
    providedIn: 'root'
})
export class PacientesService {
    private apiUrl = 'http://localhost:3000/agendamiento/pacientes';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    getPacientes(pageIndex: number, pageSize: number): Observable<PacientesResponse> {
        const params = new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString());
        return this.http.get<PacientesResponse>(this.apiUrl, { params });
    }

    // Método para actualizar un paciente (PUT)
    updatePaciente(id: number, paciente: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, paciente);
    }

    // Método para eliminar un paciente (DELETE)
    deletePaciente(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Método para crear un paciente
    createPaciente(data: any, file?: File): Observable<any> {
        const formData = new FormData();
        formData.append('primerNombre', data.primerNombre);
        formData.append('segundoNombre', data.segundoNombre);
        formData.append('primerApellido', data.primerApellido);
        formData.append('segundoApellido', data.segundoApellido);
        formData.append('nombreCompleto', data.nombreCompleto);
        formData.append('numeroIdentificacion', data.numeroIdentificacion);
        formData.append('email', data.email);
        formData.append('codigoTipoIdentificacion', data.codigoTipoIdentificacion);
        if (file) {
            formData.append('foto', file);
        }
        return this.http.post(this.apiUrl, formData);
    }
}
