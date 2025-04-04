import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaccion {
    codigoEpago: number;
    valor: number;
    // Agrega aquí los campos que retorne la API
}

@Injectable({
    providedIn: 'root'
})
export class FacturacionService {
    private apiUrl = 'http://localhost:3000/transacciones';
    constructor(private http: HttpClient) { }

    // Método para obtener transacciones con filtros
    getTransacciones(filters: any): Observable<Transaccion[]> {
        const params = new HttpParams()
            .set('fechaDesde', filters.fechaDesde || '')
            .set('fechaHasta', filters.fechaHasta || '')
            .set('codigoEpago', filters.codigoEpago || '')
            .set('cajeroId', filters.cajeroId || '');
        return this.http.get<Transaccion[]>(this.apiUrl, { params });
    }

    // Métodos para crear, actualizar y eliminar transacciones
    createTransaccion(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/transacciones`, data);
    }

    updateTransaccion(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/transacciones/${id}`, data);
    }

    deleteTransaccion(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/transacciones/${id}`);
    }
}