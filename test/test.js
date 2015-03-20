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
var constants = require('../lib/Constants');

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
});
