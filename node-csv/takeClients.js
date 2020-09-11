const csv = require('csv-parser');
const fs = require('fs');
class User {}
class Client {}
class TaxCategory {}

function cuit(cuit) {
    return (cuit.substring(0, 2) + cuit.substring(3, 5) + cuit.substring(6, 9) + cuit.substring(10, 13) + cuit.substring(14, 15));
}
const users = [];
fs.createReadStream('./2018/gral2018.csv')
    .pipe(csv())
    .on('data', (row) => {
        const user = new User();
        const client = new Client();
        const taxCategory = new TaxCategory();
        user.name = row['﻿cliente'];
        user.surname = 'completar';
        user.nickname = 'completar';
        user.email = row.email;
        let address = [];
        (row['dompart'] ? address.push({
            type: 'PARTICULAR',
            address: row['dompart']
        }) : '');
        (row['dompart'] ? address.push({
            type: 'FISCAL',
            address: row['domcom']
        }) : '');
        user.address = address;
        let phone = [];
        (row['celular'] ? phone.push({
            type: 'CELULAR',
            number: row['celular']
        }) : '');
        (row['tepart'] ? phone.push({
            type: 'PARTICULAR',
            number: row['tepart']
        }) : '');
        (row['tecom'] ? phone.push({
            type: 'COMERCIAL',
            number: row['tecom']
        }) : '');
        (row['tecom1'] ? phone.push({
            type: 'COMERCIAL',
            number: row['tecom1']
        }) : '');
        user.phone = phone;
        let fee = [];
        (row['honorarios'] ? fee.push({
            active: true,
            number: parseFloat(row['honorarios']),
            date: new Date()
        }) : '');
        client.fee = fee;
        let projectedFee = [];
        (row['honorarios_proyectado'] ? projectedFee.push({
            active: true,
            number: parseFloat(row['honorarios_proyectado']),
            date: new Date()
        }) : '');
        client.projectedFee = projectedFee;
        let personalData = {};
        (row['conyuge'] ? personalData.partner = true : '');
        (row['hijos'] ? personalData.sons = row['hijos'] : '');
        (row['fechnac'] ? personalData.birthday = new Date(row['fechnac']) : '');
        client.personalData = personalData
        let fiscalKeys = [];
        (row['clave_fiscal'] ? fiscalKeys.push({
            type: 'FISCAL',
            value: row['clave_fiscal'],
            active: true
        }) : '');
        (row['clave_fiscal_ant1'] ? fiscalKeys.push({
            type: 'FISCAL',
            value: row['clave_fiscal_ant1'],
            active: false
        }) : '');
        (row['clave_ciudad'] ? fiscalKeys.push({
            type: 'CIUDAD',
            value: row['clave_ciudad'],
            active: true
        }) : '');
        client.fiscalKeys = fiscalKeys;
        client.agency = row.agencia;
        user.active = (row.operativo == 'TRUE' ? true : false);
        taxCategory.employer = (row.empleador == 'TRUE' ? true : false);
        taxCategory.enrolled = (row.inscripto == 'TRUE' ? true : false);
        taxCategory.monotax = (row.monotributo == 'TRUE' ? true : false);
        taxCategory.exempt = (row.exento == 'TRUE' ? true : false);
        taxCategory.notEnrolled = (row.noinscripto == 'TRUE' ? true : false);
        taxCategory.ggii_exempt = (row.ib == 'EXENTO' ? true : false);
        taxCategory.ggii_simplified = (row.ib_simplificado == 'TRUE' ? true : false);
        taxCategory.ggii_sicol = (row.ib_sicol == 'TRUE' ? true : false);
        taxCategory.ggii_convention = (row.ib_convenio == 'TRUE' ? true : false);
        taxCategory.convention = (row.convenio == 'TRUE' ? true : false);
        taxCategory.earnings = (row.ganancias == 'TRUE' ? true : false);
        taxCategory.personal_property = (row.bienes_personales == 'TRUE' ? true : false);
        taxCategory.stocktaking = (row.balance == 'TRUE' ? true : false);
        client.taxCategory = taxCategory;
        client.cuit = cuit(row.cuit);
        user.role = client;
        users.push(user);
    })
    .on('end', () => {
        console.log(users);
        console.log('CSV file successfully processed');
    });