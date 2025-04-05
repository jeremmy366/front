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

    updatePaciente(id: number, paciente: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, paciente);
    }

    deletePaciente(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    createPaciente(data: any, file?: File): Observable<any> {
        const formData = new FormData();
        formData.append('primerNombre', data.primerNombre);
        formData.append('segundoNombre', data.segundoNombre || '');
        formData.append('primerApellido', data.primerApellido);
        formData.append('segundoApellido', data.segundoApellido || '');
        formData.append('nombreCompleto', data.nombreCompleto);
        formData.append('numeroIdentificacion', data.numeroIdentificacion);
        formData.append('email', data.email);
        formData.append('codigoTipoIdentificacion', data.codigoTipoIdentificacion);
        if (file) {
            formData.append('foto', file);
        }
        return this.http.post(this.apiUrl, formData);
    }

    uploadFoto(idPaciente: number, file: File): Observable<{ message: string; rutaFoto: string }> {
        const formData = new FormData();
        formData.append('foto', file);
        return this.http.post<{ message: string; rutaFoto: string }>(`${this.apiUrl}/${idPaciente}/foto`, formData);
    }
}