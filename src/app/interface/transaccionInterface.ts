export interface transaccionInterface {
    codigo_epago: number;
    fechaSolicitud: string; 
    secuenciaCajero: number;
    valor: number;
    estado: 'S' | 'N'; 
    fechaIngreso: string; 
    usuario_ingresado: string;
    fechaModificacion: string | null; 
    usuarioModificacion: string | null; 
    tipoPago?: string;      
    referencia?: string;   
}