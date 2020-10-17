const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();
io.on('connection', (client) => {
        client.on('siguienteTicket', (data, callback) => {

            let siguiente = ticketControl.siguiente();
            console.log(siguiente);
            callback(siguiente);
        });
        client.emit('estadoActual', {
            actual: ticketControl.getUltimoTicket(),
            ultimos4: ticketControl.getUltimos4()
        });
        client.on('atenderTicket', (data, callback) => {
            if (!data.escritorio) {
                return callback({
                    err: true,
                    mensaje: 'El escritorio es necesario'
                });
            }
            let atenderTicket = ticketControl.atenderTicket(data.escritorio);

            callback(atenderTicket);

            client.broadcast.emit('ultimos4', {
                ultimos4: ticketControl.getUltimos4()
            });
        });
    })
    //emitir un evento 'estadoActual'
    // {
    //     actual: ticketControl.getUltimoTicket;
    // }

// console.log('Usuario conectado');
// client.emit('enviarMensaje', {
//     usuario: 'Administrador',
//     mensaje: 'Bienvenido a esta aplicación'
// })
// client.on('disconnect', () => {
//     console.log('Usuario desconectado');
// });
// // Escuchar el client
// client.on('enviarMensaje', (data, callback) => {
//     console.log(data);
//     client.broadcast.emit('enviarMensaje', data)
//         // if (mensaje.usuario) {
//         //     callback({
//         //         resp: 'Todo salio bien!'
//         //     });
//         // } else {
//         //     callback({
//         //         resp: 'Todo salio Mal!!!!!!'
//         //     });
//         // }
// });