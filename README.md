mindelay [![CircleCI Status](https://img.shields.io/circleci/project/SkillFlowHQ/node-mindelay.svg)](https://circleci.com/gh/SkillFlowHQ/node-mindelay) [![NPM Version](https://img.shields.io/npm/v/mindelay.svg)](https://npmjs.com/package/mindelay) [![NPM Downloads](https://img.shields.io/npm/dm/mindelay.svg)](https://npmjs.com/package/mindelay) [![bitHound Overall Score](https://www.bithound.io/github/SkillFlowHQ/node-mindelay/badges/score.svg)](https://www.bithound.io/github/SkillFlowHQ/node-mindelay)
========



Pronounced as one word. Sets a minimum delay before a callback can be called, no matter how long it takes for the caller to call it.


Spec
----
```javascript
function mindelay(Function callback, Number delayMS)
  // Adds a minimum delay in milliseconds to a callback, however long the caller takes to call it.
  // Returns callback wrapped with delay code.
  //   If the wrapped callback is called before the delay is expired, it still waits until the end of the delay.
  //   If the wrapped callback is called after the delay is expired, it executes immediately.
  //   wrappedCallback.call always contains the original callback, if you need to call it directly with no delay.
  //   Alternatively, calling wrappedCallback.cancel() will cancel any delay, so that next time you call the wrapped callback it will execute immediately.
  //
  // If arguments callback, delayMS are reversed, it'll still work fine.
  // An exception is thrown if arguments have incorrect types.
  //
```

Install
-------

On command line:
```shell
$ npm install --save mindelay
```
In NodeJS:
```javascript
let mindelay = require('mindelay');
```
Alternatively, in browser JavaScript:
```html
<script src="path/to/mindelay.js"></script>
```

Usage
-----

We're using the usecase of an API response, which illustrates the utility of `mindelay` best 
and is how we use `mindelay` in production.

Instead of something like this, which responds as soon as the API responds
```javascript
apiCall(data, function(response){
  //blah
});
```
or something like this, which adds a fixed delay of one second to the API response time, no matter how long the API response time
```javascript
apiCall(data, function(response){
  setTimeout(function(){
    //blah
  }, 1000)
});
```
use something like this, which delays by at least one second, but if the API takes a long while it will respond as soon as possible.
```javascript
apiCall(data, mindelay(function(response){
  //blah
}, 1000));
```

### Cancellation
```javascript
var wrappedCallback = mindelay(function(response){
  //blah
}, 1000));
```

If you ever need to reference the callback directly, use `wrappedCallback.call`:
```javascript
wrappedCallback.call(/*...*/) //will have no delay
```

If you want to cancel any delay on a wrapped callback, use `wrappedCallback.cancel`:
```javascript
wrappedCallback.cancel()
wrappedCallback() //will have no delay
```

Example
-------

![Example: chatbot](https://i.gyazo.com/315d1749ad7f6a716f649d6822b06c53.gif)

Pictured is a chatbot (SkillFlow) that needs to make a query to a Natural Language Processing API before it's able to respond.
We want to add a somewhat natural delay, but must keep in mind that the API may take any amount of time to respond, and 
we can't just use `setTimeout` and keep the user waiting for extra long.

The solution is of course to use `mindelay` instead of `setTimeout`.

-----

Copyright &copy;2016 SkillFlow. MIT License. Created by [Clive Chan](https://github.com/cchan), with contributions from [David Tesler](https://github.com/dtesler).
