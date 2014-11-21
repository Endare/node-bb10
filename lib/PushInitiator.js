/*!
 * node-bb10
 * Copyright(c) 2013 Endare bvba <info@endare.eu>
 * MIT Licensed
 *
 * 
 * This class represents the PushInitiator that forms the 3rd party server to BlackBerry. This initiator can
 * send push messages to the PPG. More functionality will be added in the future to ask statusses, cancel
 * or replace earlier posted push messages and so on.
 * 
 * @author Sam Verschueren        <sam.verschueren@endare.com>
 * @since 18 apr. 2013 
 */

var https = require('https'),
    xml2js = require('xml2js'),
    moment = require('moment'),
    Constants = require('./Constants');

/**
 * Creats a new PushInitiator object that can be used to push messages to the Push Protocol Gateway.
 *
 * @param {Object} applicationId The unique application identifier provided by BlackBerry.
 * @param {Object} password The server side password provided by BlackBerry.
 * @param {Object} contentProviderId The CPID number provided by BlackBerry.
 * @param {Object} evaluation Set this to true if you are running in debug. Leave empty if you are running in production.
 */
function PushInititator(applicationId, password, contentProviderId, evaluation) {
    this.applicationId = applicationId;
    this.authToken = new Buffer(applicationId + ':' + password).toString('base64');
    this.contentProviderId = contentProviderId;
    this.isEvaluation = evaluation || false;
}

/**
 * Pushes the message provided to the Push Protocol Gateway. This is a server of BlackBerry that will handle
 * the push messages and will send them to the appropriate device.
 *
 * @param {Object} message The PushMessage that has to be send to the device.
 * @param {Function} callback The callback function that will be invoked when the PPG responds.
 */
PushInititator.prototype.push = function(message, callback) {
    var deliverBefore = moment().add(8, 'hours').utc();

    var body = message.toPAPMessage({
        'push-id': message.id,
        'source-reference': this.applicationId,
        'deliver-before-timestamp': deliverBefore.format('YYYY-MM-DDThh:mm:ss[Z]')
    });

    var host = 'cp' + this.contentProviderId + '.' + Constants.PRODUCTION_URL;

    // If we are running in development mode, use the eval url instead
    if(this.isEvaluation) {
        host = 'cp' + this.contentProviderId + '.' + Constants.EVAL_URL;
    }

    var post_options = {
        host: host,
        port: 443,
        path: '/mss/PD_pushRequest',
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/related; boundary=' + Constants.BOUNDARY + '; type=application/xml',
            'Content-length': Buffer.byteLength(body, 'utf8'),
            'Authorization': 'Basic ' + this.authToken
        }
    };

    var result = {};
    var err = undefined;

    var req = https.request(post_options, function(res) {
        res.setEncoding('utf8');

        res.on('end', function() {
            result.statusCode = res.statusCode;

            switch(res.statusCode) {
                // A bad request was done to the server
                case 400:
                    result.message = "The server could not understand the request.";
                    err = result;
                    break;
                // Server was not found
                case 404:
                    result.message = "The server you tried to reach was not found. Please check your CPID number if provided.";
                    err = result;
                    break;
                // Method Not Allowed (bug in this library)
                case 405:
                    result.message = "The method is not allowed.";
                    err = result;
                    break;
                // Service is unavailable
                case 503:
                    result.message = "The Push Notification Service is unable to process the request. Please try again later."
                    err = result;
                    break;
            }

            if(err !== undefined) {
                callback(err, undefined);
            }
        }).on('error', function(e) {
            console.error(e);

            err = result;
            err.error = e;

            if(callback) {
                callback(err);
            }
        }).on('data', function(data) {
            xml2js.parseString(data, function(err, res) {
                if(res && res.pap !== undefined) {
                    var response;
                    if(res.pap['push-response'] === undefined) {
                        response = res.pap['badmessage-response'][0].$;
                    }
                    else {
                        response = res.pap['push-response'][0];
                        response = response['response-result'][0].$;
                    }

                    result.statusCode = response.code;
                    result.message = response.desc;

                    callback(undefined, result);
                } else {
                    console.error(err);

                    callback(err);
                }
            });
        });
    });

    req.write(body);
    req.end();
};

module.exports = PushInititator;
