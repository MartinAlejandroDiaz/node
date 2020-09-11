// function sumar(a, b) {
//     return a + b;
// };
// let sumar = (a, b) => {
//     return a + b;
// };

// let sumar = (a, b) => a + b;

// function saludar() {
//     return 'Hola Mundo';
// }

// let saludar = () => 'Hola Mundo';

// function saludar(nombre) {
//     return `Hola ${nombre}`;
// }

// let saludar = (nombre) => `Hola ${ nombre }`

// console.log(saludar('Tino'));

let deadpool = {
    nombre: 'Wade',
    apellido: 'Winston',
    poder: 'Regeneración',
    getNombre = () => `${this.nombre} ${ this.apellido } - porder: ${this.poder}`
};

console.log(deadpool.getNombre());