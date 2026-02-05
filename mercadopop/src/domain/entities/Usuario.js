export class Usuario {
    // Ordenamos los parámetros para que coincidan con el repositorio
    constructor(id, nombreCompleto, cedula, rol = 'ARRENDATARIO', password = null, estado = 1) {
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.cedula = cedula;
        this.rol = rol;
        
        // Aquí aseguramos que el 5to dato SIEMPRE sea el password
        this.password = password;
        
        // El estado lo dejamos al final como opcional
        this.estado = estado; 
    }
}