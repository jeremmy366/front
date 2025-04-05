export interface transaccionInterface {
    codigoEpago: number;
    fechaSolicitud: string; // La fecha viene como string, puedes convertirla a un objeto Date si es necesario
    secuenciaCajero: number;
    valor: number;
    estado: 'S' | 'N'; // Asumiendo que los valores posibles son 'S' o 'N'
    fechaIngreso: string; // La fecha viene como string, puedes convertirla a un objeto Date si es necesario
    usuarioIngreso: string;
    fechaModificacion: string | null; // Puede ser null si no se ha modificado
    usuarioModificacion: string | null; // Puede ser null si no se ha modificado
    tipoPago?: string;       // Agregado para la transacción
    referencia?: string;     // Agregado para la transacción
}