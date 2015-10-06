/**
 * XMLHttp request.
 */

var Promise = require('./promise');
var XDomain = window.XDomainRequest;

module.exports = function (_, options) {

    var request = new XMLHttpRequest(), promise;

    if (XDomain && options.crossOrigin && !('withCredentials' in request)) {

        request = new XDomainRequest();
        options.headers = {};
    }

    if (_.isPlainObject(options.xhr)) {
        _.extend(request, options.xhr);
    }


    if (_.isFunction(options.beforeSend)) {

        _.warn('beforeSend has been deprecated in ^0.1.17. ' +
            'Use transformRequest or XHR options instead.'
        );

        options.beforeSend.call(this, request, options);
    }

    promise = new Promise(function (resolve) {

        request.open(options.method, _.url(options), true);
        request.timeout = options.timeout;

        if ('setRequestHeader' in request) {
            _.each(options.headers, function (value, header) {
                request.setRequestHeader(header, value);
            });
        }

        var handler = function (event) {

            request.ok = event.type === 'load';
            request.headers = 'getAllResponseHeaders' in request ? request.getAllResponseHeaders() : '';

            if (request.ok && request.status) {
                request.ok = request.status >= 200 && request.status < 300;
            }

            resolve(request);
        };

        request.onload = handler;
        request.onabort = handler;
        request.onerror = handler;
        request.ontimeout = handler;

        request.send(options.data);
    });

    return promise;
};
