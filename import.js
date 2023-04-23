var fs = require('fs');
var csv = require('csv');
var moment = require('moment');
var StockRepository = require('./src/app/repositories/stock.repository');
var CpiRateService = require('./src/app/services/cpi_rate.service');
CpiRateService = new CpiRateService();

var csvData = [];

var isStockHeader = true;

var isCPIHeader = true;

fs.createReadStream('ASXListedCompanies.csv')
    .pipe(csv.parse())
    .on('data', function (csvrow) {
        if(isStockHeader) {
            isStockHeader = false;
        }
        else {
            console.log(csvrow);
            StockRepository.findOrCreateByCode(null, csvrow[1], csvrow[0]);
        }
    });

fs.createReadStream('CPI.csv')
    .pipe(csv.parse())
    .on('data', function (csvrow) {
        if(isCPIHeader) {
            isCPIHeader = false;
        }
        else {
            console.log(csvrow);
            var date = moment(csvrow[0], 'MM-DD-YYYY').format('YYYY-MM-DD');
            return CpiRateService.updateOrCreate(date, csvrow[1]);
        }
    });