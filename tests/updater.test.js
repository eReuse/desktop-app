const expect = require('chai').expect
const fs = require('fs')
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const mocha = require('mocha')
const describe = mocha.describe
const before = mocha.before
const after = mocha.after
const beforeEach = mocha.beforeEach
const afterEach = mocha.afterEach
const it = mocha.it
// process.env.NODE_ENV = 'testing'

describe('test updater', function () {
  this.timeout(5000)
  let returnVersion, returnDeb, app, server

  function uninstallApp (done) {
    spawn('sudo', ['apt-get remove -y ereuse.org-desktopapp'])
    exec('apt-cache policy ereuse.org-desktopapp | grep Installed', (_, out) => {
      expect(out.split(':')[2].trim().length).greaterThan(0)
      done()
    })
  }

  before(function startMockServer () {
    // express
    const express = require('express')
    app = express()

    app.get('/eReuse/desktop-app/master/package.json', (req, response) => returnVersion(req, response))

    app.get('/eReuse/desktop-app/releases/download/linux-x64-0.1.1/eReuse.org-DesktopApp_0.1.1_x64.deb',
      (req, response) => returnDeb(req, response))

    server = app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
    })
  })

  beforeEach(uninstallApp)

  it('updates when there is a newer version', function (done) {
    const version = '0.0.1'
    returnVersion = function (req, res) {
      res.send(JSON.stringify({
        version: version
      }))
    }
    returnDeb = function (req, response) {
      const file = fs.readFile('./fixtures/eReuse.org-DesktopApp_' + version + '_x64.deb')
      // Check if file specified by the filePath exists
      fs.exists(file, function (exists) {
        if (exists) {
          // Content-type is very interesting part that guarantee that
          // Web browser will handle response in an appropriate manner.
          response.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename=' + file
          })
          fs.createReadStream(file).pipe(response)
        } else {
          response.writeHead(400, {'Content-Type': 'text/plain'})
          response.end('ERROR File does NOT Exists')
        }
      })
    }
    // We install a lower version
    spawn('sudo', ['gdebi -n ./fixtures/eReuse.org-DesktopApp_' + version + '_x64.deb'])

    // todo We need to change user to root
    spawn('sudo', ['../resources/after-install/add-to-crontab.sh "*/1 * * * *" "localhost:3000"'])

    setTimeout(function afterCron () {
      // We test that the app has been updated successfully
      exec('apt-cache policy ereuse.org-desktopapp | grep Installed', (_, stdout) => {
        const appVersion = stdout.split(':')[1].trim()
        expect(appVersion).equal(version)
      })
    }, 3 * 1000)
  })
  it('doesn\'t update when there is not a new version', function () {
    returnVersion = function (req, res) {
      res.send(JSON.stringify({
        version: '0.0.0'
      }))
    }
  })

  afterEach(uninstallApp)

  after(function () {
    // close server
    server.close()
    //kill port with bash -> kill $(lsof -t -i:8080)
  })
})