var _ = require('lodash');
var Route = require('../common/app.routes');

exports.getUrlPath = function (route, params) {
    return getPath(route, params, Route.URL);
}

/**
 * pathsCollection: URL or API. See core/common/app.routes.js for details
 */
function getPathTemplate(route, pathsCollection) {
    if (route.parent) {
        let path = getPathTemplate(pathsCollection[route.parent], pathsCollection) + '/' + route.path;
        return path;
    }
    return route.path;
}

/**
 * pathsCollection: URL or API. See core/common/app.routes.js for details
 */
function getPath(route, params, pathsCollection) {
    let path = getPathTemplate(route, pathsCollection);

    let routeParams = _.map(path.match(/:\w+/g), function (param) {
        return param.substring(1);
    });

    let queryArray = [];

    _.each(_.keys(params), function (key) {
        if (_.indexOf(routeParams, key) > -1) {
            path = path.replace(':' + key, params[key]);
        } else {
            queryArray.push(key + '=' + params[key]);
        }
    });

    path += (queryArray.length ? '?' + queryArray.join('&') : '');

    return '/' + path;
}