'use strict';

/*!
 * node-bb10
 * Copyright(c) 2013 Endare bvba <info@endare.com>
 * MIT Licensed
 *
 *
 * This class forms the message that will be send to the Push Protocol Gateway. The message is uniquely
 * identified.
 *
 * @author Sam Verschueren        <sam.verschueren@gmail.com>
 * @since 18 apr. 2013
 */

var constants = require('./Constants');

/**
 * Creates a new message that can be pushed to the Push Protocol Gateway. The PushMessage has a unique identifier
 * to identify the message in the outside world. This identifier must be globaly unique. Therefore, the id is mostly
 * constructed out of the company's url in combination with the name of the application and the timestamp. An example of
 * the id could be com.company.myapp13254655416 where myapp is the name of the application.
 *
 * @param {String} id       An identifier that should be unique around the world. Mostly a combination of the company's url and the timestamp.
 * @param {String} message  The message that should be send to the Push Protocol Gateway.
 */
function PushMessage(id, message) {
    this.id = id;
    this.setMessage(message);
    this.setDeliveryMethod('notspecified');

    this.recipients = [];
}

/**
 * Sets the message that needs to be pushed to the device.
 *
 * @param {String} message The message that should be send to the Push Protocol Gateway.
 */
PushMessage.prototype.setMessage = function(message) {
    this.message = message;
};

/**
 * The delivery-method attribute is used to specify the over the air delivery desired by the Push Initiator.
 * Valid values are "confirmed", "preferconfirmed", "unconfirmed" and "notspecified". The
 * value "unconfirmed" means that the message MUST be delivered in an unconfirmed manner. Note that a
 * Push Initiator may request client confirmation without requesting ppg-notify-requested-to - the result
 * is that the message is confirmed over the air but the PPG does not inform the Push Initiator. The value
 * "preferconfirmed" allows the Push Initiator to inform the PPG of preferences. The PPG SHOULD try to
 * deliver the message as preferred, but may use another method if not able to use the preferred choice. The value
 * "unconfirmed" means that the message MUST be delivered in an unconfirmed manner. The value
 * "notspecified" indicates that the Push Initiator does not care whether the PPG uses confirmed delivery or
 * unconfirmed delivery - the choice is up to the PPG.
 *
 * @param  {String} deliveryMethod  The delivery desired by the Push Initiator.
 * @throws {Error}                  If the delivery method is not valid.
 */
PushMessage.prototype.setDeliveryMethod = function(deliveryMethod) {
    if(constants.DELIVERY_METHODS.indexOf(deliveryMethod) === -1) {
        throw new Error('The delivery method must be one of the following: confirmed | preferconfirmed | unconfirmed | notspecified');
    }

    this.deliveryMethod = deliveryMethod;
};

/**
 * Removes all the recipients from the recipient list.
 */
PushMessage.prototype.clearRecepients = function() {
    this.recipients = [];
};

/**
 * Adds a new recipient to the message.
 *
 * @param {Object} token The unique token of the recipient.
 */
PushMessage.prototype.addRecipient = function(token) {
    this.recipients.push(token);
};

/**
 * Adds multiple recipients at once.
 *
 * @param {Object} tokens An array of unique recipient tokens.
 */
PushMessage.prototype.addAllRecipients = function(tokens) {
    for(var i = 0; i < tokens.length; i++) {
        this.addRecipient(tokens[i]);
    }
};

/**
 * Converts the PushMessage to the correct Push Access Protocol message.
 *
 * @param  {Object} options The attribute options of the push message.
 * @throws {Error}          If the message doesn't have any recipients.
 */
PushMessage.prototype.toPAPMessage = function(options) {
    if(this.recipients.length === 0) {
        throw new Error('Please add some recipients before sending this PushMessage.');
    }

    var body = '';
    body += '--' + constants.BOUNDARY + constants.NEW_LINE;
    body += 'Content-Type: application/xml; charset=UTF-8' + constants.NEW_LINE;
    body += '' + constants.NEW_LINE;
    body += '<?xml version="1.0"?>' + constants.NEW_LINE;
    body += '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">' + constants.NEW_LINE;
    body += '<pap>' + constants.NEW_LINE;

    var attributes = '';

    for(var key in options) {
        attributes += key + '="' + options[key] + '" ';
    }

    body += '    <push-message ' + attributes + '>' + constants.NEW_LINE;

    for(var i = 0; i < this.recipients.length; i++) {
        body += '        <address address-value="' + this.recipients[i] + '" />' + constants.NEW_LINE;
    }

    body += '        <quality-of-service delivery-method="' + this.deliveryMethod + '" />' + constants.NEW_LINE;
    body += '    </push-message>' + constants.NEW_LINE;
    body += '</pap>' + constants.NEW_LINE;
    body += '--' + constants.BOUNDARY + constants.NEW_LINE;
    body += 'Content-Encoding: binary' + constants.NEW_LINE;
    body += 'Content-Type: text/html' + constants.NEW_LINE;
    body += 'Push-Message-ID: ' + this.id + constants.NEW_LINE;
    body += '' + constants.NEW_LINE;
    body += this.message + constants.NEW_LINE;
    body += '' + constants.NEW_LINE;
    body += '--' + constants.BOUNDARY + '--' + constants.NEW_LINE;
    body += '' + constants.NEW_LINE;

    return body;
};

module.exports = PushMessage;
