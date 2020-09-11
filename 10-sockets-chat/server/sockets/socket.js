const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');
// const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }

        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.emit.to(data.sala)('listaPersona', usuarios.getPersonas() );
        
        callback(personas);
    })

    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });

    client.on('disconnect', () => {
        let personaBorrarda = usuarios.borrarPersona(client.id);
        client.broadcast.emit('crearMensaje', crearMensaje('Administrador',`${personaBorrarda.nombre} abandono el chat`));
        client.broadcast.emit('listaPersona', usuarios.getPersonas() );
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {
        client.broadcast.emit('enviarMensaje', data);
    });

    client.on('crearMensaje', (data) => {
      let persona = usuarios.getPersona(client.id)
      let mensaje = crearMensaje(persona.nombre, data.mensaje);
      client.broadcast.emit('crearMensaje', mensaje);
    })

    // Mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});