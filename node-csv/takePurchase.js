const csv = require('csv-parser');
const fs = require('fs');
const purchases = [];
const purchasesNotDefined = [];

function cuit(cuit) {
    return (cuit.substring(0, 2) + cuit.substring(3, 5) + cuit.substring(6, 9) + cuit.substring(10, 13) + cuit.substring(14, 15));
}

function jurisdiction(jurisdiction) {
    switch (jurisdiction) {
        case 'CAPITAL':
            return 0;
        case 'BUENOS AIRES':
            return 1;
        case 'CATAMARCA':
            return 2;
        case 'CHACO':
            return 3;
        case 'CHUBUT':
            return 4;
        case 'CORDOBA':
            return 5;
        case 'CORRIENTES':
            return 6;
        case 'ENTRE RIOS':
            return 7;
        case 'FORMOSA':
            return 8;
        case 'JUJUY':
            return 9;
        case 'LA PAMPA':
            return 10;
        case 'LA RIOJA':
            return 11;
        case 'MENDOZA':
            return 12;
        case 'MISIONES':
            return 13;
        case 'NEUQUEN':
            return 14;
        case 'RIO NEGRO':
            return 15
        case 'SALTA':
            return 16;
        case 'SAN JUAN':
            return 17;
        case 'SAN LUIS':
            return 18;
        case 'SANTA CRUZ':
            return 19;
        case 'SANTA FE':
            return 20;
        case 'SANTIAGO DEL ESTERO':
            return 21;
        case 'TIERRA DEL FUEGO':
            return 22;
        case 'TUCUMAN':
            return 23;
        default:
            return 0;
    }
}

function billType(type) {
    switch (type) {
        // Factura A 0
        case 'FACT A':
            return 0;
        case 'Fact A':
            return 0;
        case 'FAC A':
            return 0;
        case 'RETENCION':
            return 0;
        case '':
            return 0;
            // Nota de debito A 1
        case 'N.Dto.':
            return 1;
        case 'NDB A':
            return 1;
        case 'NDTO A':
            return 1;
            // Nota de credito A 2
        case 'N.Cto.A':
            return 2;
        case 'NCR A':
            return 2;
        case 'NCTO A':
            return 2;
            // Recibo A 3
            // Factura B 4
        case 'Fact B':
            return 4;
        case 'FAC B':
            return 4;
        case 'FACT B':
            return 4;
            // Nota de debito B 5
        case '7':
            return 5;
        case 'NDTO B':
            return 5;
            // Nota de credito B 6
        case '008':
            return 6;
        case '8':
            return 6;
        case 'NCR B':
            return 6;
        case 'N.Cto.B':
            return 6;
        case 'NCTO B':
            return 6;
            // Recibo B 7
        case '009':
            return 7;
        case '9':
            return 7;
            // Factura C 8
        case 'Fact C':
            return 8;
        case 'Fact.C':
            return 8;
        case 'FACT C':
            return 8;
            // Nota de debito C 9
            // Nota de credito C 10
            // Recibo C 11
            // Ticket 12
        case 'TICKET':
            return 12;
        case 'TICKETS':
            return 12;
            // Factura M 13
        case 'Fact M':
            return 13;
        case 'FACT. M':
            return 13;
        default:
            purchasesNotDefined.push(type);
            return type;
            break;
    }
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
class Purchase {}

function samePurchase(purchase1, purchase2) {
    if (purchase1.cuit == purchase2.cuit &&
        purchase1.month == purchase2.month &&
        purchase1.jurisdiction == purchase2.jurisdiction &&
        purchase1.cuitSeller == purchase2.cuitSeller &&
        purchase1.salePoint == purchase2.salePoint &&
        purchase1.date.getDate() == purchase2.date.getDate() &&
        purchase1.date.getDay() == purchase2.date.getDay() &&
        purchase1.date.getMonth() == purchase2.date.getMonth() &&
        purchase1.date.getFullYear() == purchase2.date.getFullYear() &&
        purchase1.number == purchase2.number &&
        purchase1.billType == purchase2.billType) {
        return true;
    } else {
        return false;
    }
}

function load(purchase) {
    let purchase1 = purchases.find(purchase1 => samePurchase(purchase1, purchase));
    if (purchase1 != null) {
        purchase1.withholding.vat += purchase.withholding.vat;
        purchase1.withholding.earnings += purchase.withholding.earnings;
        purchase1.withholding.grossIncome += purchase.withholding.grossIncome;
        purchase1.withholding.personalProperty += purchase.withholding.personalProperty;
        purchase1.moneySchema.push(purchase.moneySchema[0]);
    } else {
        purchases.push(purchase);
    }
}

fs.createReadStream('./2018/compras2018.csv')
    .pipe(csv())
    .on('data', (row) => {
        const purchase = new Purchase();
        purchase.cuit = cuit(row['﻿cuit']);
        purchase.seller = row.proveedor;
        purchase.cuitSeller = deleteMarks(row.cuitprov);
        purchase.billType = billType(row.tipo);
        purchase.loadDate = new Date(row.fechahora);
        purchase.date = new Date(row.fecha);
        purchase.month = (row.mesclave ? parseInt(row.mesclaves) : new Date(row.fecha).getMonth());
        (purchase.month ? '' : purchase.month = new Date(row.fecha).getMonth())
        purchase.salePoint = row.ncomp.substring(0, row.ncomp.indexOf('-'));
        purchase.number = row.ncomp.substring(row.ncomp.indexOf('-') + 1, 20);
        purchase.jurisdiction = jurisdiction(row.jurisdiccion);
        purchase.active = true;
        purchase.loader = [];
        purchase.client = {};
        let moneySchema = [];
        moneySchema.push({
            vatRate: parseFloat(row.tasa.replace(',', '.')),
            vatAmount: parseFloat(row.iva.replace(',', '.')),
            net: parseFloat(row.neto.replace(',', '.'))
        });
        purchase.moneySchema = moneySchema;
        let withholding = {};
        (row.retiva ? withholding.vat = parseFloat(row.retiva.replace(',', '.')) : '');
        (row.retgan ? withholding.earnings = parseFloat(row.retgan.replace(',', '.')) : '');
        (row.retib ? withholding.grossIncome = parseFloat(row.retib.replace(',', '.')) : '');
        (row.retbbii ? withholding.personalProperty = parseFloat(row.retbbii.replace(',', '.')) : '');
        purchase.withholding = withholding;
        purchase.exempt = parseFloat(row.exento.replace(',', '.'));
        purchase.other = parseFloat(row.otros.replace(',', '.'));
        purchase.total = parseFloat(row.total.replace(',', '.'));
        load(purchase);
        // console.log(purchase.moneySchema);
        // (!purchases.includes(row.jurisdiccion) ? purchases.push(row.jurisdiccion) : '');
        // (!purchases.includes(row.tipo) ? purchases.push(row.tipo) : '');
    })
    .on('end', () => {
        console.log(purchases);
        console.log(purchasesNotDefined);
        console.log('CSV file successfully processed');
    });