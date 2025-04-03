import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    private apiUrl = 'http://localhost:3000/facturacion'; // Ajusta la URL

    constructor(private http: HttpClient) { }

    // Método para obtener transacciones con filtros
    getTransacciones(filters: any): Observable<Transaccion[]> {
        // Se puede enviar filters como query params. Ejemplo:
        return this.http.get<Transaccion[]>(`${this.apiUrl}/transacciones`, { params: filters });
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