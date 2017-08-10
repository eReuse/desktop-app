// A simple test to verify a visible window is opened with a title
// const Application = require('spectron').Application
const path = require('path')
// const chai = require('chai')
// const chaiAsPromised = require('chai-as-promised')
const helpers = require('./global-setup.test')
// const assert = require('assert')

// const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
/* CrossPlataform
if (process.platform === 'win32') {
  electronPath += '.cmd'
}

const appPath = path.join(__dirname, '..')

const app = new Application({
  path: electronPath,
  args: [appPath]
})

global.before(function () {
  chai.should()
  chai.use(chaiAsPromised)
}) */

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('example application launch', function () {
  helpers.setupTimeout(this)

  let app = null

  beforeEach(function () {
    return helpers.startApplication({
      args: [path.join(__dirname, 'fixtures', 'example')]
    }).then(function (startedApp) { app = startedApp })
  })

  afterEach(function () {
    return helpers.stopApplication(app)
  })

  it('opens a window', function () {
    return app.client.waitUntilWindowLoaded()
      .browserWindow.focus()
      .getWindowCount().should.eventually.equal(1)
      .browserWindow.isMinimized().should.eventually.be.false
      .browserWindow.isDevToolsOpened().should.eventually.be.false
      .browserWindow.isVisible().should.eventually.be.true
      .browserWindow.isFocused().should.eventually.be.true
      .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
      .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
  })

  describe('when the make larger button is clicked', function () {
    it('increases the window height and width by 10 pixels', function () {
      return app.client.waitUntilWindowLoaded()
        .browserWindow.getBounds().should.eventually.have.property('width', 800)
        .browserWindow.getBounds().should.eventually.have.property('height', 400)
        .click('.btn-make-bigger')
        .browserWindow.getBounds().should.eventually.have.property('width', 810)
        .browserWindow.getBounds().should.eventually.have.property('height', 410)
    })
  })

  describe('when the make smaller button is clicked', function () {
    it('decreases the window height and width by 10 pixels', function () {
      return app.client.waitUntilWindowLoaded()
        .browserWindow.getBounds().should.eventually.have.property('width', 800)
        .browserWindow.getBounds().should.eventually.have.property('height', 400)
        .click('.btn-make-smaller')
        .browserWindow.getBounds().should.eventually.have.property('width', 790)
        .browserWindow.getBounds().should.eventually.have.property('height', 390)
    })
  })
})

/*
describe('Test Example', function () {
  beforeEach(function () {
    return app.start()
  })
  afterEach(function () {
    return app.stop()
  })

  it('opens a window', function () {
    return app.client.waitUntilWindowLoaded().getWindowCount().should.eventually.equal(1)
  })

  it('tests the title', function () {
    return app.client.waitUntilWindowLoaded().getTitle().should.eventually.equal('My eReuse.org & Support')
  })
}) */