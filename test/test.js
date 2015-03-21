'use strict';

/*!
 * node-bb10
 * Copyright(c) 2013 Endare bvba <info@endare.com>
 * MIT Licensed
 *
 *
 * This file runs all the tests of the library
 *
 * @author Sam Verschueren        <sam.verschueren@gmail.com>
 * @since 20 Mar. 2015
 */

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

var should = chai.should();
chai.use(sinonChai);

// library
var bb10 = require('../index'),
    PushMessage = bb10.PushMessage,
    constants = require('../lib/Constants');

describe('node-bb10', function() {

    describe('Constants', function() {

        it('Should have a boundary that is equal to \'PMasdfglkjhqwert\'', function() {
            constants.BOUNDARY.should.be.equal('PMasdfglkjhqwert');
        });

        it('Should have \'\\r\\n\' as new line separator', function() {
            constants.NEW_LINE.should.be.equal('\r\n');
        });

        it('Should have the correct eval URL', function() {
            constants.EVAL_URL.should.be.equal('pushapi.eval.blackberry.com');
        });

        it('Should have the correct production URL', function() {
            constants.PRODUCTION_URL.should.be.equal('pushapi.na.blackberry.com');
        });
    });

    describe('PushMessage', function() {

        describe('#constructor', function() {

            it('Should throw an error if no ID is provided', function() {
                PushMessage.bind(PushMessage).should.throw(Error);
            });

            it('Should throw an error if an empty ID is provided', function() {
                PushMessage.bind(PushMessage, '').should.throw(Error);
            });

            it('Should set the ID of it is provided', function() {
                var message = new PushMessage('test-id');

                message.id.should.be.equal('test-id');
            });

            it('Should trim the whitespace of the ID', function() {
                var message = new PushMessage('    test-id     ');

                message.id.should.be.equal('test-id');
            });

            it('Should set a blank message if no message is provided', function() {
                var message = new PushMessage('test-id');

                message.message.should.be.equal('');
            });

            it('Should set the message if one is provided', function() {
                var message = new PushMessage('test-id', 'Hello World');

                message.message.should.be.equal('Hello World');
            });

            it('Should set the delivery method to \'notspecified\'', function() {
                var message = new PushMessage('test-id', 'Hello World');

                message.deliveryMethod.should.be.equal('notspecified');
            });

            it('Should have an empty list of recipients', function() {
                var message = new PushMessage('test-id', 'Hello World');

                message.recipients.should.have.length(0);
            });
        });

        describe('#setMessage', function() {

            var message;

            beforeEach(function() {
                // Be sure to create a new message every time
                message = new PushMessage('test-id');
            });

            it('Should set the message correctly', function() {
                message.setMessage('hello message');

                message.message.should.be.equal('hello message');
            });

            it('Should set a blank message if undefined is passed in as parameter', function() {
                message.setMessage(undefined);

                message.message.should.be.equal('');
            });
        });

        describe('#setDeliveryMethod', function() {

            var message;

            beforeEach(function() {
                // Be sure to create a new message every time
                message = new PushMessage('test-id');
            });

            it('Should throw an error if the delivery method does not exist', function() {
                message.setDeliveryMethod.bind(message.setDeliveryMethod, 'unknownmethod').should.throw(Error);
            });

            it('Should not throw an error if the delivery method is \'confirmed\'', function() {
                message.setDeliveryMethod.bind(message.setDeliveryMethod, 'confirmed').should.not.throw(Error);
            });

            it('Should not throw an error if the delivery method is \'preferconfirmed\'', function() {
                message.setDeliveryMethod.bind(message.setDeliveryMethod, 'preferconfirmed').should.not.throw(Error);
            });

            it('Should not throw an error if the delivery method is \'unconfirmed\'', function() {
                message.setDeliveryMethod.bind(message.setDeliveryMethod, 'preferconfirmed').should.not.throw(Error);
            });

            it('Should not throw an error if the delivery method is \'unconfirmed\'', function() {
                message.setDeliveryMethod.bind(message.setDeliveryMethod, 'notspecified').should.not.throw(Error);
            });

            it('Should set the delivery method to \'unconfirmed\'', function() {
                message.setDeliveryMethod('unconfirmed');

                message.deliveryMethod.should.be.equal('unconfirmed');
            });
        });

        describe('#addRecipient', function() {

            var message;

            beforeEach(function() {
                // Be sure to create a new message every time
                message = new PushMessage('test-id');
            });

            it('Should add one recipient to the list', function() {
                message.addRecipient('FFFFFFFF');

                message.recipients.should.have.length(1);
            });

            it('Should add the recipient \'FFFFFFFF\' to the list', function() {
                message.addRecipient('FFFFFFFF');

                message.recipients[0].should.be.equal('FFFFFFFF');
            });

            it('Should add two recipients to the list if it is called twice with different tokens', function() {
                message.addRecipient('FFFFFFFF');
                message.addRecipient('AAAAAAAA');

                message.recipients.should.have.length(2);
            });

            it('Should only have one recipient if it is called twice with the same token', function() {
                message.addRecipient('FFFFFFFF');
                message.addRecipient('FFFFFFFF');

                message.recipients.should.have.length(1);
            });
        });

        describe('#addAllRecipients', function() {

            var message;

            beforeEach(function() {
                // Be sure to create a new message every time
                message = new PushMessage('test-id');
            });

            it('Should throw an error if the argument provided is not an array', function() {
                message.addAllRecipients.bind(message.addAllRecipients, 'FFFFFFFF').should.throw(Error);
            });

            it('Should add two recipients to the recipients list', function() {
                message.addAllRecipients(['AAAAAAAA', 'FFFFFFFF']);

                message.recipients.should.have.length(2);
            });

            it('Should only add unique recipients', function() {
                message.addAllRecipients(['AAAAAAAA', 'FFFFFFFF', 'AAAAAAAA']);

                message.recipients.should.have.length(2);
            });

            it('Should just append the recipients if it called twice', function() {
                message.addAllRecipients(['AAAAAAAA', 'FFFFFFFF']);
                message.addAllRecipients(['BBBBBBBB', 'CCCCCCCC']);

                message.recipients.should.have.length(4);
            });
        });

        describe('#clearRecipients', function() {

            var message;

            beforeEach(function() {
                // Be sure to create a new message every time
                message = new PushMessage('test-id');
                message.addAllRecipients(['AAAAAAAA', 'FFFFFFFF']);
            });

            it('Should clear the list of recipients', function() {
                message.clearRecipients();

                message.recipients.should.have.length(0);
            });
        });

        describe('#toPAPMessage', function() {

            var message;

            beforeEach(function() {
                // Be sure to create a new message every time
                message = new PushMessage('test-id', 'Message content');
                message.addRecipient('AAAAAAAA');
            });

            it('Should throw an error if no recipients are added to the message', function() {
                message.clearRecipients();

                message.toPAPMessage.bind(message.toPAPMessage).should.throw(Error);
            });

            it('Should convert to the correct PAP message with only one recipient', function() {
                var result = message.toPAPMessage({ "source-reference": "applicationID", "deliver-before-timestamp": "2015-05-21T12:00:00Z" });

                var pap = [
                            '--PMasdfglkjhqwert',
                            'Content-Type: application/xml; charset=UTF-8',
                            '',
                            '<?xml version="1.0"?>',
                            '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">',
                            '<pap>',
                            '    <push-message push-id="test-id" source-reference="applicationID" deliver-before-timestamp="2015-05-21T12:00:00Z">',
                            '        <address address-value="AAAAAAAA" />',
                            '        <quality-of-service delivery-method="notspecified" />',
                            '    </push-message>',
                            '</pap>',
                            '--PMasdfglkjhqwert',
                            'Content-Encoding: binary',
                            'Content-Type: text/html',
                            'Push-Message-ID: test-id',
                            '',
                            'Message content',
                            '',
                            '--PMasdfglkjhqwert--',
                            constants.NEW_LINE
                         ];

                result.should.be.equal(pap.join(constants.NEW_LINE));
            });

            it('Should convert to the correct PAP message with two recipients', function() {
                message.addAllRecipients(['AAAAAAAA', 'FFFFFFFF']);

                var result = message.toPAPMessage({ "source-reference": "applicationID", "deliver-before-timestamp": "2015-05-21T12:00:00Z" });

                var pap = [
                            '--PMasdfglkjhqwert',
                            'Content-Type: application/xml; charset=UTF-8',
                            '',
                            '<?xml version="1.0"?>',
                            '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">',
                            '<pap>',
                            '    <push-message push-id="test-id" source-reference="applicationID" deliver-before-timestamp="2015-05-21T12:00:00Z">',
                            '        <address address-value="AAAAAAAA" />',
                            '        <address address-value="FFFFFFFF" />',
                            '        <quality-of-service delivery-method="notspecified" />',
                            '    </push-message>',
                            '</pap>',
                            '--PMasdfglkjhqwert',
                            'Content-Encoding: binary',
                            'Content-Type: text/html',
                            'Push-Message-ID: test-id',
                            '',
                            'Message content',
                            '',
                            '--PMasdfglkjhqwert--',
                            constants.NEW_LINE
                         ];

                result.should.be.equal(pap.join(constants.NEW_LINE));
            });

            it('Should convert to the correct PAP message when setting a different message', function() {
                message.setMessage('This is another message');

                var result = message.toPAPMessage({ "source-reference": "applicationID", "deliver-before-timestamp": "2015-05-21T12:00:00Z" });

                var pap = [
                            '--PMasdfglkjhqwert',
                            'Content-Type: application/xml; charset=UTF-8',
                            '',
                            '<?xml version="1.0"?>',
                            '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">',
                            '<pap>',
                            '    <push-message push-id="test-id" source-reference="applicationID" deliver-before-timestamp="2015-05-21T12:00:00Z">',
                            '        <address address-value="AAAAAAAA" />',
                            '        <quality-of-service delivery-method="notspecified" />',
                            '    </push-message>',
                            '</pap>',
                            '--PMasdfglkjhqwert',
                            'Content-Encoding: binary',
                            'Content-Type: text/html',
                            'Push-Message-ID: test-id',
                            '',
                            'This is another message',
                            '',
                            '--PMasdfglkjhqwert--',
                            constants.NEW_LINE
                         ];

                result.should.be.equal(pap.join(constants.NEW_LINE));
            });

            it('Should convert to the correct PAP message with another delivery method', function() {
                message.setDeliveryMethod('unconfirmed');

                var result = message.toPAPMessage({ "source-reference": "applicationID", "deliver-before-timestamp": "2015-05-21T12:00:00Z" });

                var pap = [
                            '--PMasdfglkjhqwert',
                            'Content-Type: application/xml; charset=UTF-8',
                            '',
                            '<?xml version="1.0"?>',
                            '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">',
                            '<pap>',
                            '    <push-message push-id="test-id" source-reference="applicationID" deliver-before-timestamp="2015-05-21T12:00:00Z">',
                            '        <address address-value="AAAAAAAA" />',
                            '        <quality-of-service delivery-method="unconfirmed" />',
                            '    </push-message>',
                            '</pap>',
                            '--PMasdfglkjhqwert',
                            'Content-Encoding: binary',
                            'Content-Type: text/html',
                            'Push-Message-ID: test-id',
                            '',
                            'Message content',
                            '',
                            '--PMasdfglkjhqwert--',
                            constants.NEW_LINE
                         ];

                result.should.be.equal(pap.join(constants.NEW_LINE));
            });

            it('Should convert to the correct PAP message with another ID, recipient and message', function() {
                message = new PushMessage('my-message-id', 'Hello World');
                message.addRecipient('BBBBBBBB');

                var result = message.toPAPMessage({ "source-reference": "source-refID", "deliver-before-timestamp": "2015-05-21T16:00:00Z" });

                var pap = [
                            '--PMasdfglkjhqwert',
                            'Content-Type: application/xml; charset=UTF-8',
                            '',
                            '<?xml version="1.0"?>',
                            '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">',
                            '<pap>',
                            '    <push-message push-id="my-message-id" source-reference="source-refID" deliver-before-timestamp="2015-05-21T16:00:00Z">',
                            '        <address address-value="BBBBBBBB" />',
                            '        <quality-of-service delivery-method="notspecified" />',
                            '    </push-message>',
                            '</pap>',
                            '--PMasdfglkjhqwert',
                            'Content-Encoding: binary',
                            'Content-Type: text/html',
                            'Push-Message-ID: my-message-id',
                            '',
                            'Hello World',
                            '',
                            '--PMasdfglkjhqwert--',
                            constants.NEW_LINE
                         ];

                result.should.be.equal(pap.join(constants.NEW_LINE));
            });
        });
    });
});
