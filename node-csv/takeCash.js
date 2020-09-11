const csv = require('csv-parser');
const fs = require('fs');
const cashs = [];

function cuit(cuit) {
    return (cuit.substring(0, 2) + cuit.substring(3, 5) + cuit.substring(6, 9) + cuit.substring(10, 13) + cuit.substring(14, 15));
}

function deleteMarks(string) {
    let string2;
    string2 = string.replace('.', '');
    string2 = string2.replace('-', '');
    if (string2.includes('-' || string2.includes('.'))) {
        string2 = deleteMarks(string2);
    }
    return string2;
}

class Cash {}

fs.createReadStream('./2018/cajaFOX.csv')
    .pipe(csv())
    .on('data', (row) => {
        const cash = new Cash();
        cash.cuit = cuit(row.cuit)
        cash.date = new Date(row.fecha);
        cash.legend = row.leyenda;
        cash.code = row.codigo;
        cash.imputable = row.imputable;
        cash.cashSeat = row.asiento;
        cash.creditBalance = row.saldo_acreedor;
        cash.debitBalance = row.saldo_deudor;
        cash.clientFee = {};
        cashs.push(cash);
    })
    .on('end', () => {
        console.log(cashs);
        console.log('CSV file successfully processed');
    });