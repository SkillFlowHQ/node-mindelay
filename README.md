mindelay [![CircleCI Status](https://circleci.com/gh/SkillFlowHQ/node-mindelay.svg)](https://circleci.com/gh/SkillFlowHQ/node-mindelay) [![NPM Version](https://img.shields.io/npm/v/mindelay.svg)](http://npmjs.com/package/mindelay) [![bitHound Overall Score](https://www.bithound.io/github/SkillFlowHQ/node-mindelay/badges/score.svg)](https://www.bithound.io/github/SkillFlowHQ/node-mindelay)
========



Pronounced as one word. Sets a minimum delay before a callback can be called, no matter how long it takes for the caller to call it.


Spec
----
```javascript
function mindelay(function callback, number delayMS)
  // Adds a minimum delay in milliseconds to a callback, however long the caller takes to call it.
  // If the callback is called before the delay is expired, it still waits until the end of the delay.
  // If the callback is called after the delay is expired, it executes immediately.
  //
  // If arguments are reversed, it'll still work fine.
  // An exception is thrown if arguments have incorrect types.
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

Example
-------

![Example: chatbot](https://i.gyazo.com/315d1749ad7f6a716f649d6822b06c53.gif)

Pictured is a chatbot (SkillFlow) that needs to make a query to a Natural Language Processing API before it's able to respond.
We want to add a somewhat natural delay, but must keep in mind that the API may take any amount of time to respond, and 
we can't just use `setTimeout` and keep the user waiting for extra long.

The solution is of course to use `mindelay` instead of `setTimeout`.

Copyright &copy;2016 SkillFlow.  Module created by none other than [Clive Chan](https://github.com/cchan).
