/*!
 * node-bb10
 * Copyright(c) 2013 Endare bvba <info@endare.eu>
 * MIT Licensed
 *
 * 
 * This class forms the message that will be send to the Push Protocol Gateway. The message is uniquely
 * identified.
 * 
 * @author Sam Verschueren        <verschueren.sam@endare.eu>
 * @since 18 apr. 2013
 */

var Constants = require('./Constants');

/**
 * Creates a new message that can be pushed to the Push Protocol Gateway. The PushMessage has a unique identifier
 * to identify the message in the outside world. This identifier must be globaly unique. Therefore, the id is mostly
 * constructed out of the company's url in combination with the name of the application and the timestamp. An example of
 * the id could be com.company.myapp13254655416 where myapp is the name of the application.
 *
 * @param {Object} id An identifier that should be unique around the world. Mostly a combination of the company's url and the timestamp.
 * @param {Object} message The message that should be send to the Push Protocol Gateway.
 */
function PushMessage(id, message) {
    this.id = id;
    this.setMessage(message);
    this.setDeliveryMethod('notspecified');

    this.recipients = new Array();
}

/**
 * Sets the message that needs to be pushed to the device.
 *
 * @param {Object} message The message
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
 * @param {Object} deliveryMethod The delivery desired by the Push Initiator.
 */
PushMessage.prototype.setDeliveryMethod = function(deliveryMethod) {
    if(deliveryMethod !== 'confirmed' && deliveryMethod !== 'preferconfirmed' && deliveryMethod !== 'unconfirmed' && deliveryMethod !== 'notspecified') {
        throw 'The delivery method must be one of the following: confirmed | preferconfirmed | unconfirmed | notspecified'
    }

    this.deliveryMethod = deliveryMethod;
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
 * @param {Object} options The attribute options of the push message.
 */
PushMessage.prototype.toPAPMessage = function(options) {
    if(this.recipients.length == 0) {
        throw "Please add some recipients before sending this PushMessage.";
    }

    var body = '';
    body += '--' + Constants.BOUNDARY + Constants.NEW_LINE;
    body += 'Content-Type: application/xml; charset=UTF-8' + Constants.NEW_LINE;
    body += '' + Constants.NEW_LINE;
    body += '<?xml version="1.0"?>' + Constants.NEW_LINE;
    body += '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">' + Constants.NEW_LINE;
    body += '<pap>' + Constants.NEW_LINE;

    var attributes = '';

    for(var key in options) {
        attributes += key + '="' + options[key] + '" ';
    }

    body += '    <push-message ' + attributes + '>' + Constants.NEW_LINE;

    for(var i = 0; i < this.recipients.length; i++) {
        body += '        <address address-value="' + this.recipients[i] + '" />' + Constants.NEW_LINE;
    }

    body += '        <quality-of-service delivery-method="' + this.deliveryMethod + '" />' + Constants.NEW_LINE;
    body += '    </push-message>' + Constants.NEW_LINE;
    body += '</pap>' + Constants.NEW_LINE;
    body += '--' + Constants.BOUNDARY + Constants.NEW_LINE;
    body += 'Content-Encoding: binary' + Constants.NEW_LINE;
    body += 'Content-Type: text/html' + Constants.NEW_LINE;
    body += 'Push-Message-ID: ' + this.id + Constants.NEW_LINE;
    body += '' + Constants.NEW_LINE;
    body += this.message + Constants.NEW_LINE;
    body += '' + Constants.NEW_LINE;
    body += '--' + Constants.BOUNDARY + '--' + Constants.NEW_LINE;
    body += '' + Constants.NEW_LINE;

    return body;
};

module.exports = PushMessage;
