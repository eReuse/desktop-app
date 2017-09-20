const expect = require('chai').expect
const {describe, it, before, after, beforeEach, afterEach} = require('mocha')

describe('Test Workbench', function () {
  this.timeout(5000)
  it('execute workbench', function (done) {
    const generateAndSubmitSnapshot = require('../app/js/generateAndSubmitSnapshot.js')
    expect(generateAndSubmitSnapshot())
    //check that json is generated and send to devicehub
  })
})