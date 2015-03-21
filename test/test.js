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
    });
});
