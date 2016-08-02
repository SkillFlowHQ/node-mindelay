/*
 * mindelay.js
 *
 * Defines the `mindelay` function. See `README.md` for details.
 */

/* eslint no-invalid-this: "off" */
/* eslint consistent-this: "off" */
"use strict";

function mindelay(callback, delayMS) {
  let self = this || null; //May be undefined. That's fine, we'll just go with the default apply() this-value of null.

  if (typeof callback === "number" && typeof delayMS === "function")
    callback = [delayMS, delayMS = callback][0]; //wanted to write [callback, delayMS] = [delayMS, callback], but that's ES6
  else if (typeof callback !== "function" || typeof delayMS !== "number")
    throw new TypeError("mindelay expects a callback function and a delay");

  let endMS = (new Date().getTime()) + delayMS;
  return function() {
    let args = arguments;
    if (typeof this !== "undefined") //the caller can bind a `this`, or otherwise it'll just default to the this from above.
      self = this;
    let now = new Date().getTime();
    if (now < endMS)
      setTimeout(function() {
        callback.apply(self, args);
      }, endMS - now);
    else
      callback.apply(self, args);
  };
}

if (typeof module !== "undefined" && module.exports)
  module.exports = mindelay;
