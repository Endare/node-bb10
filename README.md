# node-bb10

[![Build Status](http://img.shields.io/travis/Endare/node-bb10.svg)](https://travis-ci.org/Endare/node-bb10)

> Send push notifications to a BlackBerry 10 application easily.

## Installation
```bash
$ npm install node-bb10
```
## Requirements

A BlackBerry 10 device and the appropriate keys that you get from BlackBerry when [registering
your application](http://developer.blackberry.com/services/push/).

## Usage

```js
var bb10 = require('node-bb10');

// create a message and add recipients
var message = new bb10.PushMessage('com.example.test@1459836', 'Hello World!');
message.addRecipient('00000000');                       // The PIN number of the recipient
message.addAllRecipients(['00000001', '00000002']);     // Add multiple recipient at once

// The default delivery method is 'notspecified'
message.setDeliveryMethod('unconfirmed');

// Create the push initiator
var initiator = new bb10.PushInitiator(applicationId, password, CPID);

initiator.push(message, function(err, result) {
    if(err) {
        console.log('Oops, something went wrong.');
        console.log(err.statusCode);
        console.log(err.message);
    }
    else {
        console.log(result.statusCode);
        console.log(result.message);
    }
});
```

<dl>
  <dt>ID</dt>
  <dd>
    The ID identifies the message you push to the user. This ID must be unique, not only within your app but
    in the entire world! Most of the time, people make a combination of their packagename and a timestamp. An example of an ID could be ```com.endare.appName@1374148800```
  </dd>
  <dt>applicationID and password</dt>
  <dd>When you register your application with BlackBerry, they will send you an email with these credentials. Just copy-paste them in here and you should be good to go!</dd>

  <dt>CPID</dt>
  <dd>CPID stands for Content Provider ID and is provided by BlackBerry as well. Just look into the email you received and copy-paste this ID.</dd>
</dl>

### Broadcast

If you want to send a push message to all the devices registered by your application, you can use the broadcast method of the push initiator.

```js
// create a message, no need to add recipients
var message = new bb10.PushMessage('uniqueID', 'Hello World!');

// Create the push initiator
var initiator = new bb10.PushInitiator(applicationId, password, CPID);

// Broadcast the message to all the subscribers
initiator.broadcast(message, function(err, result) {
    // Handle result
});
```

### Development

If you are testing your application, BlackBerry works with an evaluation URL. If you want to run in evaluation/development mode you should add an extra parameter
when creating the pushinitiator.

```js
var initiator = new bb10.PushInitiator(applicationId, password, CPID, true);
```

## Contributors
 * Sam Verschueren (Author)     <sam.verschueren@gmail.com>
 * Oliver Salzburg              <oliver.salzburg@gmail.com>

## Changelog
**1.0.0:**
 * first release

**1.0.3:**
 * Fixed issues regarding Date object. Used MomentJS instead.
 * Fixed issue regarding undefined response of res.pap
 * Cleaned up code

**1.1.0:**
 * Added ```broadcast``` functionality
 * Added better error handling
 * Added tests, except for the PushInitiator

## The full MIT license

The MIT License

Copyright (c) 2013 Endare BVBA <info@endare.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
