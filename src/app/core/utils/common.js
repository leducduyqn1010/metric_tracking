const moment = require('moment');
const _ = require('lodash');
module.exports.getMonthsFromDateRange = function (fromDate, toDate) {
    let startDate = moment(fromDate);
    let endDate = moment(toDate);
    let listMonth = [];

    let nextMonth = moment(startDate);
    let month = {};
    while (nextMonth < endDate || (nextMonth.year() === endDate.year() && nextMonth.month() === endDate.month())) {
        month = {
            fromDate: nextMonth.startOf('month').format('YYYY-MM-DD'),
            toDate: nextMonth.endOf('month').format('YYYY-MM-DD'),
            month: nextMonth.month() + 1,
            year: nextMonth.year()
        };
        listMonth.push(month);
        nextMonth.add(1, "month");
    }

    return listMonth;
};

module.exports.mapDataReportOfMonth = function(listTimeUnitFromUtils, listDataFromDB) {
    //Mapping list month of year generate from utils to obj
    const mapMonths = Object.assign({}, ...listTimeUnitFromUtils.map(s => ({
        [`${s.year}-${s.month}`]: {year: s.year, month: s.month, statisticList: []}
    })));
    listDataFromDB.forEach(o => {
        if (mapMonths[`${o.year}-${o.month}`]) {
            mapMonths[`${o.year}-${o.month}`].statisticList.push({
                trackingDate: o.trackingDate,
                unit: o.unit,
                value: o.value,
            })
        }

    });

    //Mapping a obj to array obj
    return  Object.keys(mapMonths).map((key) => mapMonths[key]);
};