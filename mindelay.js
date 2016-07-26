/*
mindelay.js

(tbh this should be published on npm ;) )

function mindelay(function callback, number delayMS)
  Adds a minimum delay in milliseconds to a callback, however long the caller takes to call it.
  If the callback is called before the delay is expired, it still waits until the end of the delay.
  If the callback is called after the delay is expired, it executes immediately.

  If arguments are reversed, it'll still work fine.
  An exception is thrown if arguments have incorrect types.

Usage:
  //INSTEAD OF:
  apiCall(data, function(response){
    //blah
  });

  //USE:
  apiCall(data, mindelay(function(response){
    //blah
  }, 1000));
*/
/*eslint no-invalid-this: "off"*/
/*eslint consistent-this: "off"*/

function mindelay(callback, delayMS){
  var self = this || null; //May be undefined. That's fine, we'll just go with the default apply() this-value of null.

  if(typeof callback === "number" && typeof delayMS === "function")
    callback = [delayMS, delayMS = callback][0]; //wanted to write [callback, delayMS] = [delayMS, callback]; but idk if there's es6
  else if(typeof callback !== "function" || typeof delayMS !== "number")
    throw new TypeError("minDelay expects a callback function and a delay");

  var endMS = (new Date().getTime()) + delayMS;
  return function(...args){
    if(typeof this !== "undefined") //the caller can bind a `this`, or otherwise it'll just default to the this from above.
      self = this;
    var now = new Date().getTime();
    if(now < endMS)
      setTimeout(function(){ callback.apply(self, args); }, endMS - now);
    else
      callback.apply(self, args);
  }
}

if(typeof module !== "undefined" && module.exports)
  module.exports = mindelay;
