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

//milliseconds of leeway in callback timings
const msAbove = 20;
const msBelow = 5;

describe("Callback timing with minimum delay", function() {
  return;
  const times = 5;

  for (let i = 0; i <= times; i++) {
    it("delays until one second when called in " + (i / times) + " seconds",
      function(done) {
        this.timeout(1000 + 1000 / times);

        let startTime = new Date().getTime();
        let wrappedCallback = mindelay(function() {
          let delta = new Date().getTime() - startTime;
          expect(delta).to.be.within(1000 - msBelow, 1000 + msAbove);
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
          expect(delta).to.be.within(expected - msBelow, expected + msAbove);
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
      expect(delta).to.be.within(200 - msBelow, 200 + msAbove);
      done();
    }, 200);
    caller(wrappedCallback, 100);
  });

  it("allows arguments to be swapped", function(done) {
    let startTime = new Date().getTime();
    let wrappedCallback = mindelay(200, function() {
      let delta = new Date().getTime() - startTime;
      expect(delta).to.be.within(200 - msBelow, 200 + msAbove);
      done();
    });
    caller(wrappedCallback, 100);
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
    }, 200);
    caller(wrappedCallback, 100);
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
    caller(wrappedCallback, 100);
  }.bind(thisvar));

  it("captures `this` when directly bound to mindelay", function() {
    let wrappedCallback = mindelay.bind(thisvar)(function() {
      expect(this()).to.equal("asdf");
      expect(this.a).to.equal("apple");
    }, 100);
    caller(wrappedCallback, 100);
  }.bind(fakethisvar));

  it("captures `this` when bound to caller", function() {
    let wrappedCallback = mindelay.bind(fakethisvar)(function() {
      expect(this()).to.equal("asdf");
      expect(this.a).to.equal("apple");
    }, 100);
    caller.bind(thisvar)(wrappedCallback, 100);
  }.bind(fakethisvar));

  it("captures `this` when bound to wrapped callback", function() {
    let wrappedCallback = mindelay.bind(fakethisvar)(function() {
      expect(this()).to.equal("asdf");
      expect(this.a).to.equal("apple");
    }, 100);
    caller.bind(fakethisvar)(wrappedCallback.bind(thisvar), 100);
  }.bind(fakethisvar));

  it("captures `this` when directly bound to callback", function() {
    let wrappedCallback = mindelay.bind(fakethisvar)(function() {
      expect(this()).to.equal("asdf");
      expect(this.a).to.equal("apple");
    }.bind(thisvar), 100);
    caller.bind(fakethisvar)(wrappedCallback.bind(fakethisvar), 100);
  }.bind(fakethisvar));

  it("should error", function() {
    let wrappedCallback = mindelay.bind(fakethisvar)(function() {
      expect(this()).to.equal("asdf");
      expect(this.a).to.equal("apple");
    }.bind(fakethisvar), 100);
    caller.bind(fakethisvar)(wrappedCallback.bind(fakethisvar), 100);
  }.bind(fakethisvar));
});
