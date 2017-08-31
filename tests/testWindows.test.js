// A simple test to verify a visible window is opened with a title
const Application = require('spectron').Application
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')

let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron')
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
})

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('Test Example', function () {
  this.timeout(10000)
  beforeEach(function () {
    return app.start()
  })
  afterEach(function () {
    return app.stop()
  })

  xit('opens a window', function () {
    return app.client.waitUntilWindowLoaded().getWindowCount().equal(1)
  })

  it('tests the title', function () {
    return app.client.waitUntilWindowLoaded().getTitle().then(function (title) {
      expect(title).equal('My eReuse.org & Support')
    })
  })
})
