var _ = require('lodash');
var hooker = require('hooker');
var Constants = require('../common/Constants');

function BusinessFormulas() {

    var thisBusinessFormulas = this;

    hooker.hook(thisBusinessFormulas, _.functionsIn(thisBusinessFormulas), {
        pre: function () {
            var args = _.map(arguments, function (num) {
                return +num || 0;
            });
            return hooker.filter(thisBusinessFormulas, args);
        },
        post: function(result) {
            if (result && typeof result === 'number') {
                return hooker.override(result.toFixed(Constants.MAX_RIGHT_DIGITS) * 1);
            }
            return result;
        }
    });

}

BusinessFormulas.prototype.meterToCentimeter = function (value) {
    return value * 100;
}

BusinessFormulas.prototype.meterToInch = function (value) {
    return value / 0.0254;
}

BusinessFormulas.prototype.meterToFeet = function (value) {
    return value * 3.28;
}

BusinessFormulas.prototype.meterToYard = function (value) {
    return value * 1.09361;
}

BusinessFormulas.prototype.centimeterToMeter = function (value) {
    return value / 100;
}

BusinessFormulas.prototype.inchToMeter = function (value) {
    return value * 0.0254;
}

BusinessFormulas.prototype.feetToMeter = function (value) {
    return value / 3.28;
}

BusinessFormulas.prototype.yardToMeter = function (value) {
    return value / 1.09361;
}

/**
 * @return {number}
 */
BusinessFormulas.prototype.CToF = function (value) {
    return (value * (9/5)) + 32;
}

BusinessFormulas.prototype.CToK = function (value) {
    return value + 273.15;
}

/**
 * @return {number}
 */
BusinessFormulas.prototype.FToC = function (value) {
    return (value - 32) * (5/9);
}

/**
 * @return {number}
 */
BusinessFormulas.prototype.KToC = function (value) {
    return value - 273.15;
}



module.exports = new BusinessFormulas();