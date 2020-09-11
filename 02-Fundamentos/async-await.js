/**
 * Async Await
 */

// let getNombre = async() => {
//     // throw new Error('No existe un nombre para ese usuario')
//     return 'Tino';
// };
let getNombre = () => {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            resolve('Tino');
        }, 3000);

        // resolve('tino');
    })
}

let saludo = async() => {
    let nombre = await getNombre();

    return `Hola ${nombre}`;
}

// getNombre().then(nombre => {
//         console.log(nombre);
//     })
//     .catch(e => {
//         console.log('Error de ASYNC', e);
//     })
saludo().then(mensaje => {
    console.log(mensaje);
})