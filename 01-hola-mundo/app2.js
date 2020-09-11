function saludar(nombre) {
    let mensaje = `Hola ${ nombre }`;

    return mensaje;
}

let saludo = saludar('Martín');

console.log(saludo);