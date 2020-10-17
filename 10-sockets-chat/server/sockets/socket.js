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

       usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala) );
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador',`${data.nombre} se unio al chat`));
        callback(usuarios.getPersonasPorSala(data.sala));
    })

    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });

    client.on('disconnect', () => {
        let personaBorrarda = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrarda.sala).emit('crearMensaje', crearMensaje('Administrador',`${personaBorrarda.nombre} abandono el chat`));
        client.broadcast.to(personaBorrarda.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrarda.sala) );
    });

    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {
        client.broadcast.emit('enviarMensaje', data);
    });

    client.on('crearMensaje', (data, callback) => {
      let persona = usuarios.getPersona(client.id)
      let mensaje = crearMensaje(persona.nombre, data.mensaje);
      client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
      callback(mensaje);
    })

    // Mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});