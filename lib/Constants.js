'use strict';

/*!
 * node-bb10
 * Copyright(c) 2013 Endare bvba <info@endare.com>
 * MIT Licensed
 */

/**
 * All the constants that are used in the node-bb10 library will be declared
 * in this file.
 *
 * @author Sam Verschueren        <sam.verschueren@gmail.com>
 * @since 18 apr. 2013
 */
var Constants = {
    BOUNDARY: 'PMasdfglkjhqwert',
    NEW_LINE: '\r\n',
    EVAL_URL: 'pushapi.eval.blackberry.com',
    PRODUCTION_URL: 'pushapi.na.blackberry.com',
    DELIVERY_METHODS: [
        'confirmed',
        'preferconfirmed',
        'unconfirmed',
        'notspecified'
    ]
};

module.exports = Constants;
