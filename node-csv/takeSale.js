const csv = require('csv-parser');
const fs = require('fs');
const sales = [];
const salesNotDefined = [];

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
        case 'NDB A':
            return 1;
        case 'NDTO A':
            return 1;
            // Nota de credito A 2
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
        case 'FACT. M':
            return 13;
        default:
            salesNotDefined.push(type);
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
class Sale {}

function sameSale(sale1, sale2) {
    if (sale1.cuit == sale2.cuit &&
        sale1.cuitBuyer == sale2.cuitBuyer &&
        sale1.salePoint == sale2.salePoint &&
        sale1.month == sale2.month &&
        sale1.jurisdiction == sale2.jurisdiction &&
        sale1.date.getDate() == sale2.date.getDate() &&
        sale1.date.getDay() == sale2.date.getDay() &&
        sale1.date.getMonth() == sale2.date.getMonth() &&
        sale1.date.getFullYear() == sale2.date.getFullYear() &&
        sale1.number == sale2.number &&
        sale1.billType == sale2.billType) {
        return true;
    } else {
        return false;
    }
}

function load(sale) {
    let sale1 = sales.find(sale1 => sameSale(sale1, sale));
    if (sale1 != null) {
        sale1.withholding.vat += sale.withholding.vat;
        sale1.withholding.earnings += sale.withholding.earnings;
        sale1.withholding.grossIncome += sale.withholding.grossIncome;
        sale1.withholding.personalProperty += sale.withholding.personalProperty;
        sale1.moneySchema.push(sale.moneySchema[0]);
        console.log(sale1.moneySchema);
    } else {
        sales.push(sale);
    }
}

fs.createReadStream('./2018/ventas2018.csv')
    .pipe(csv())
    .on('data', (row) => {
        const sale = new Sale();
        sale.cuit = cuit(row.cuit);
        sale.buyer = row.nomb;
        sale.cuitBuyer = deleteMarks(row.cuitven);
        sale.billType = billType(row.tipocomp);
        sale.loadDate = new Date(row.fechahora);
        sale.date = new Date(row.fecha);
        sale.month = (row.mes ? new Date(row.fecha).getMonth() : parseInt(row.mes));
        sale.salePoint = row.num.substring(0, row.num.indexOf('-'));
        sale.number = row.num.substring(row.num.indexOf('-') + 1, 20);
        sale.jurisdiction = jurisdiction(row.jurisdiccion);
        sale.active = true;
        sale.loader = [];
        sale.client = {};
        let moneySchema = [];
        moneySchema.push({
            vatRate: parseFloat(row.tasaiva.replace(',', '.')),
            vatAmount: parseFloat(row.iva.replace(',', '.')),
            net: (parseFloat(row.neto.replace(',', '.')) != 0 ? parseFloat(row.neto.replace(',', '.')) : parseFloat(row.neto_b.replace(',', '.')))
        });
        sale.moneySchema = moneySchema;
        let withholding = {};
        (row.retiva ? withholding.vat = parseFloat(row.retiva.replace(',', '.')) : '');
        (row.retgan ? withholding.earnings = parseFloat(row.retgan.replace(',', '.')) : '');
        (row.retib ? withholding.grossIncome = parseFloat(row.retib.replace(',', '.')) : '');
        (row.retbbii ? withholding.personalProperty = parseFloat(row.retbbii.replace(',', '.')) : '');
        sale.withholding = withholding;
        sale.exempt = parseFloat(row.exento.replace(',', '.'));
        sale.other = parseFloat(row.otro.replace(',', '.'));
        sale.total = parseFloat(row.total.replace(',', '.'));
        load(sale);
        // console.log(sale.moneySchema);
        // (!sales.includes(row.jurisdiccion) ? sales.push(row.jurisdiccion) : '');
        // (!sales.includes(row.tipocomp) ? sales.push(row.tipocomp) : '');
    })
    .on('end', () => {
        console.log(sales);
        console.log(salesNotDefined);
        console.log('CSV file successfully processed');
    });