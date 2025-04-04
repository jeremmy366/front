export interface pacienteInterface {
    idPaciente: number;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    nombreCompleto: string;
    numeroIdentificacion: string;
    email: string;
    codigoTipoIdentificacion: string; // Agregar esta propiedad
    rutaFoto?: string;
}
