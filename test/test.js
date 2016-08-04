/* eslint no-unused-expressions: "off" */
/* eslint no-extra-bind: "off" */
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
          expect(delta).to.be.within(1000 - 5, 1000 + 20);
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

describe("mindelay argument handling", function() {
  it("takes two arguments: function and delay in ms", function(done) {
    let startTime = new Date().getTime();
    let wrappedCallback = mindelay(function() {
      let delta = new Date().getTime() - startTime;
      expect(delta).to.be.within(200 - 5, 200 + 20);
      done();
    }, 200);
    wrappedCallback();
  });
  it("allows arguments to be swapped", function(done) {
    let startTime = new Date().getTime();
    let wrappedCallback = mindelay(200, function() {
      let delta = new Date().getTime() - startTime;
      expect(delta).to.be.within(200 - 5, 200 + 20);
      done();
    });
    wrappedCallback();
  });
  it("does not allow missing args", function() {
    expect(mindelay.bind(null, function() {})).to.throw(TypeError);
    expect(mindelay.bind(null, 200)).to.throw(TypeError);
    expect(mindelay.bind(null)).to.throw(TypeError);
  });
});

describe("callback argument handling", function() {
  it("allows the callback to receive arguments correctly", function(done) {
    let wrappedCallback = mindelay(function(a, b, c) {
      expect(a).to.equal("Some random arguments");
      expect(b).to.be.undefined;
      expect(c).to.equal(42);
      done();
    }, 1000);
    caller(wrappedCallback, 500);
  });
});

describe("`this` variable scoping", function() {
  let thisvar = function() {
    return "asdf";
  };
  thisvar.a = "apple";
  let fakethisvar = function() {
    return "nope";
  };
  fakethisvar.a = "nope";

  it("captures `this` when mindelay()-calling scope has `this`", function() {
    let wrappedCallback = mindelay(function() {
      expect(this()).to.equal("asdf");
      expect(this.a).to.equal("apple");
    }, 100);
    wrappedCallback();
  }.bind(thisvar));
});
