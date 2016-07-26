"use strict";

let expect = require("chai").expect;
let mindelay = require("../mindelay.js");

describe("Callback timing behavior", function() {
  const times = 10;

  for(let i = 0; i < times; i++) {
    it("waits until one second is up when called in " + (i / times) +" seconds", function(done) {
      this.timeout(1000 + 1000 / times);

      let startTime = new Date().getTime();
      let minnedCallback = mindelay(function(){
        let delta = new Date().getTime() - startTime;
        expect(delta).to.be.within(1000, 1010); //typically 1.000-1.001 seconds
        done();
      }, 1000);
      setTimeout(minnedCallback, 1000 / times *  i);
    });
  }

  for(let i = times + 1; i <= 2 * times; i++) {
    it("does not wait when called in " + (i / times) +" seconds", function(done) {
      this.timeout(1000 / times * (i+1));

      let startTime = new Date().getTime();
      let minnedCallback = mindelay(function(){
        let delta = new Date().getTime() - startTime;
        let expected = 1000 / times * i;
        expect(delta).to.be.within(expected, expected + 10);
        done();
      }, 1000);
      setTimeout(minnedCallback, 1000 / times *  i);
    });
  }
});
