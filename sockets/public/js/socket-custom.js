var socket = io();
socket.on('connect', function() {
        console.log(`Conectado al servidor`);
    })
    // Escucha sucesos
socket.on('disconnect', function() {
        console.log('Perdimos conexión con el servidor');
    })
    // Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Tino',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server:', resp);
    // console.log('Se disparó el coallback');
});
// Escucha la información recibida en el proceso 'enviarMensaje'
socket.on('enviarMensaje', function(mensaje) {
    console.log('servidor:', mensaje);
})