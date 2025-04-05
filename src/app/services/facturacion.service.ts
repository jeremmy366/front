import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaccionInterface } from '../interface/transaccionInterface';

export interface TransaccionesResponse {
    rows: transaccionInterface[];
    totalRows: number;
}

@Injectable({
    providedIn: 'root'
})
export class FacturacionService {
    private apiUrl = 'http://localhost:3000/transacciones';

    constructor(private http: HttpClient) { }

    getTransacciones(params: HttpParams): Observable<TransaccionesResponse> {
        return this.http.get<TransaccionesResponse>(this.apiUrl, { params });
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