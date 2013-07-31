/*!
 * node-bb10
 * Copyright(c) 2013 Endare bvba <info@endare.eu>
 * GPLv3 Licensed
 */

/**
 * Extending the Date object with an own written formatter. It uses the same keys as php.
 *  
 * @since 2012-08-21
 * @author Sam Verschueren  <verschueren.sam@endare.eu> 
 * @param format        The formatted string
 */
Date.prototype.format = function(format) {
    // DAY
    var d = this.getDate()<10?"0"+this.getDate():this.getDate();                // Day of the month, 2 digits with leading zeros
    var j = this.getDate();                                                     // A textual representation of a day, three letters
    var N = this.getDay()+1;                                                    // ISO-8601 numeric representation of the day of the week

    // MONTH
    var m = this.getMonth()+1<10?"0"+(this.getMonth()+1):(this.getMonth()+1);   // Numeric representation of a month, with leading zeros
    var n = this.getMonth();                                                    // Numeric representation of a month, without leading zeros
    
    // YEAR
    var Y = this.getFullYear();                                                 // A full numeric representation of a year, 4 digits
    var y = this.getFullYear().toString().substr(2,2);                          // A two digit representation of a year

    // TIME
    var G = this.getHours();                                                    // 24-hour format of an hour without leading zeros
    var H = this.getHours()<10?"0"+this.getHours():this.getHours();             // 24-hour format of an hour with leading zeros
    var i = this.getMinutes()<10?"0"+this.getMinutes():this.getMinutes();       // Minutes with leading zeros
    var s = this.getSeconds()<10?"0"+this.getSeconds():this.getSeconds();       // Seconds, with leading zeros
    var u = this.getMilliseconds();                                             // Milliseconds. (Range is 0-999).

    var matches = format.match(/([a-zA-Z])/g);
    
    for(var index=0; index<matches.length; index++) {
    	try {
    		format = format.replace(matches[index], eval(matches[index]));
    	}
    	catch(e) {
    		// do nothing if a ReferenceError occurs
		}
    }
    
    return format;
}

module.exports = Date;