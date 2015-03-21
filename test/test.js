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
                message.addRecipient('FFFFFFF');
                message.addRecipient('AAAAAAA');

                message.recipients.should.have.length(2);
            });

            it('Should only have one recipient if it is called twice with the same token', function() {
                message.addRecipient('FFFFFFF');
                message.addRecipient('FFFFFFF');

                message.recipients.should.have.length(1);
            });
        });
    });
});
