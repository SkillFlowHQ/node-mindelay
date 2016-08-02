/* eslint no-unused-expressions: "off" */
"use strict";

let expect = require("chai").expect;
let mindelay = require("../mindelay.js");

function caller(callback, delay) {
  setTimeout(function() {
    callback("Some random arguments", undefined, 42);
  }, delay);
}

describe("Callback timing with minimum delay", function() {
  const times = 5;

  for (let i = 0; i <= times; i++) {
    it("delays until one second when called in " + (i / times) + " seconds",
      function(done) {
        this.timeout(1000 + 1000 / times);

        let startTime = new Date().getTime();
        let wrappedCallback = mindelay(function() {
          let delta = new Date().getTime() - startTime;
          expect(delta).to.be.within(995, 1020);
          done();
        }, 1000);
        caller(wrappedCallback, 1000 / times * i);
      }
    );
  }

  for (let i = times + 1; i <= 2 * times; i++) {
    it("does not delay when called in " + (i / times) + " seconds",
      function(done) {
        this.timeout(1000 / times * (i + 1));

        let startTime = new Date().getTime();
        let wrappedCallback = mindelay(function() {
          let delta = new Date().getTime() - startTime;
          let expected = 1000 / times * i;
          expect(delta).to.be.within(expected - 5, expected + 20);
          done();
        }, 1000);
        caller(wrappedCallback, 1000 / times * i);
      }
    );
  }
});

describe("argument handling", function() {
  it("allows the callback to receive arguments correctly", function() {
    caller(function(a, b, c) {
      expect(a).to.equal("Some random arguments");
      expect(b).to.be.undefined;
      expect(c).to.equal(42);
    }, 1000);
  });
});

describe("`this` variable scoping", function() {

});
