const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('./2018/emp_acumSinObsyConve.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });