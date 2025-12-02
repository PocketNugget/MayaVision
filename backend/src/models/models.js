/**
 * Chichen Itzá Virtual Tour System - Object Model
 * Implements the UML design with private properties and validation.
 */

// 1. ZonaGeografica
class ZonaGeografica {
    #idZona;
    #nombre;
    #descripcion;
    #esPrivada;

    constructor(idZona, nombre, descripcion, esPrivada = false) {
        this.#idZona = idZona;
        this.#nombre = nombre;
        this.#descripcion = descripcion;
        this.#esPrivada = esPrivada;
    }

    get idZona() { return this.#idZona; }
    get nombre() { return this.#nombre; }
    get descripcion() { return this.#descripcion; }
    get esPrivada() { return this.#esPrivada; }

    permitirAcceso(rol) {
        if (!this.#esPrivada) return true;
        // Logic to check if role has permission
        return rol.validarAcceso(this);
    }

    mostrarInformacion() {
        return `Zona: ${this.#nombre}, Descripción: ${this.#descripcion}`;
    }
    
    toJSON() {
        return {
            idZona: this.#idZona,
            nombre: this.#nombre,
            descripcion: this.#descripcion,
            esPrivada: this.#esPrivada
        };
    }
}

// 2. Rol & Permiso
class Permiso {
    #idPermiso;
    #descripcion;

    constructor(idPermiso, descripcion) {
        this.#idPermiso = idPermiso;
        this.#descripcion = descripcion;
    }
}

class Rol {
    #idRol;
    #nombreRol;
    #permisos = [];

    constructor(idRol, nombreRol) {
        this.#idRol = idRol;
        this.#nombreRol = nombreRol;
    }

    validarAcceso(zona) {
        // Simplified logic: 'Guide' and 'Researcher' can access private zones
        if (zona.esPrivada) {
            return ['Guide', 'Researcher'].includes(this.#nombreRol);
        }
        return true;
    }

    agregarPermiso(permiso) {
        if (permiso instanceof Permiso) {
            this.#permisos.push(permiso);
        }
    }
}

// 3. Servidor
class Servidor {
    #idServidor;
    #ubicacion;
    #capacidadUsuarios;
    #estado;
    #usuariosAsignados = [];

    constructor(idServidor, ubicacion, capacidadUsuarios, estado) {
        this.#idServidor = idServidor;
        this.#ubicacion = ubicacion;
        this.#capacidadUsuarios = capacidadUsuarios;
        this.#estado = estado;
    }

    asignarUsuario(participante) {
        if (this.#usuariosAsignados.length < this.#capacidadUsuarios) {
            this.#usuariosAsignados.push(participante);
            return true;
        }
        return false;
    }

    liberarUsuario(participante) {
        this.#usuariosAsignados = this.#usuariosAsignados.filter(p => p !== participante);
    }

    sincronizarEstados() {
        console.log(`Sincronizando estado de ${this.#usuariosAsignados.length} usuarios en servidor ${this.#idServidor}`);
    }
}

// 4. Avatar
class Avatar {
    #idAvatar;
    #tipoAvatar;
    #estado;
    #posicionX;
    #posicionY;
    #zonaActual;
    #idRol;

    constructor(idAvatar, tipoAvatar, estado = 'Idle', idRol = null) {
        this.#idAvatar = idAvatar;
        this.#tipoAvatar = tipoAvatar;
        this.#estado = estado;
        this.#posicionX = 0.0;
        this.#posicionY = 0.0;
        this.#zonaActual = null;
        this.#idRol = idRol;
    }

    actualizarEstado(nuevoEstado) {
        this.#estado = nuevoEstado;
    }

    cambiarPosicion(x, y) {
        this.#posicionX = x;
        this.#posicionY = y;
    }

    set zonaActual(zona) {
        if (zona instanceof ZonaGeografica) {
            this.#zonaActual = zona;
        }
    }
    
    get zonaActual() { return this.#zonaActual; }

    set idRol(id) { this.#idRol = id; }
    get idRol() { return this.#idRol; }

    toJSON() {
        return {
            idAvatar: this.#idAvatar,
            tipoAvatar: this.#tipoAvatar,
            estado: this.#estado,
            posicionX: this.#posicionX,
            posicionY: this.#posicionY,
            idRol: this.#idRol
        };
    }
}

// 5. Participante (Base Class)
class Participante {
    #idParticipante;
    #nombre;
    #correo;
    #username;
    #password;
    #conexionActiva;
    #ubicacionActual;
    #servidorAsignado;
    #avatar; // Association 1 to 1

    constructor(idParticipante, nombre, correo, username = null, password = null) {
        this.#idParticipante = idParticipante;
        this.#nombre = nombre;
        this.#correo = correo;
        this.#username = username;
        this.#password = password;
        this.#conexionActiva = false;
        this.#ubicacionActual = 'Lobby';
        this.#servidorAsignado = null;
    }

    conectarse() {
        this.#conexionActiva = true;
        console.log(`${this.#nombre} se ha conectado.`);
    }

    desconectarse() {
        this.#conexionActiva = false;
        console.log(`${this.#nombre} se ha desconectado.`);
    }

    moverA(zona) {
        if (zona instanceof ZonaGeografica) {
            this.#ubicacionActual = zona.nombre;
            if (this.#avatar) {
                this.#avatar.zonaActual = zona;
            }
            console.log(`${this.#nombre} se movió a ${zona.nombre}`);
        }
    }

    enviarMensaje(mensaje) {
        console.log(`${this.#nombre} dice: ${mensaje}`);
    }

    set avatar(avatar) {
        if (avatar instanceof Avatar) {
            this.#avatar = avatar;
        }
    }
    
    get idParticipante() { return this.#idParticipante; }
    get nombre() { return this.#nombre; }
    get username() { return this.#username; }
}

// 6. GuiaTurista (Inherits from Participante)
class GuiaTurista extends Participante {
    #certificacion;
    #idioma;

    constructor(idParticipante, nombre, correo, certificacion, idioma) {
        super(idParticipante, nombre, correo);
        this.#certificacion = certificacion;
        this.#idioma = idioma;
    }

    iniciarRecorrido() {
        console.log(`Guía ${this.nombre} ha iniciado el recorrido.`);
    }

    explicarZona(zona) {
        console.log(`Guía ${this.nombre} está explicando: ${zona.mostrarInformacion()}`);
    }

    asistirParticipante(participante) {
        console.log(`Guía ${this.nombre} está asistiendo a ${participante.nombre}`);
    }
}

// 7. RecorridoVirtual
class RecorridoVirtual {
    #idRecorrido;
    #tipo;
    #fechaInicio;
    #duracion;
    #guia; // 0..1
    #participantes = []; // 1..* (Aggregation)
    #zonas = []; // 1..* (Association)

    constructor(idRecorrido, tipo, fechaInicio, duracion) {
        this.#idRecorrido = idRecorrido;
        this.#tipo = tipo;
        this.#fechaInicio = new Date(fechaInicio);
        this.#duracion = duracion;
    }

    iniciar() {
        console.log(`Recorrido ${this.#idRecorrido} iniciado.`);
        if (this.#guia) this.#guia.iniciarRecorrido();
    }

    finalizar() {
        console.log(`Recorrido ${this.#idRecorrido} finalizado.`);
    }

    registrarActividad(act) {
        console.log(`Actividad registrada: ${act}`);
    }

    agregarZona(zona) {
        if (zona instanceof ZonaGeografica) {
            this.#zonas.push(zona);
        }
    }

    agregarParticipante(participante) {
        if (participante instanceof Participante) {
            this.#participantes.push(participante);
        }
    }
    
    asignarGuia(guia) {
        if (guia instanceof GuiaTurista) {
            this.#guia = guia;
        }
    }
}

module.exports = {
    ZonaGeografica,
    Rol,
    Permiso,
    Servidor,
    Avatar,
    Participante,
    GuiaTurista,
    RecorridoVirtual
};
