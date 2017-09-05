const expect = require('chai').expect
const path = require('path')
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
  let app, server

  let version = '0.0.1'
  let returnVersion = function (req, res) {
    res.send(JSON.stringify({
      version: version,
      name: 'eReuse.org-DesktopApp'
    }))
  }
  const returnDeb = function (req, response) {
    const pathDeb = path.join(__dirname + '/fixtures/eReuse.org-DesktopApp_' + version + '_x64.deb')
    const options = {
      'Content-Type': 'application/octet-stream'
    }
    response.sendFile(pathDeb, options)
  }

  function uninstallApp (done) {
    spawn('apt-get', ['remove', '-y', 'ereuse.org-desktopapp'])
    //spawn('sudo', ['apt-get remove -y ereuse.org-desktopapp'])
    exec('apt-cache policy ereuse.org-desktopapp | grep -w "Installed: (none)"', (_, out) => {
      // We double check we have correctly uninstalled the app
      expect(out).contains('none')
      done()
    })
  }

  before(function startMockServer () {
    // express
    const express = require('express')
    app = express()

    app.get('/eReuse/desktop-app/master/package.json', (req, response) => returnVersion(req, response))

    app.get('/eReuse/desktop-app/releases/download/linux-x64-' + version + '/eReuse.org-DesktopApp_' + version + '_x64.deb',
      (req, response) => returnDeb(req, response))

    server = app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
    })
  })

  //beforeEach(uninstallApp)

  it('updates when there is a newer version', function (done) {
    this.timeout(0)
    // We install a lower version
    const res = spawn('sudo', ['gdebi -n ./fixtures/eReuse.org-DesktopApp_' + version + '_x64.deb'])
    res.on('exit', function ensureAppIsInstalled() {
      // We ensure we have installed the app
      exec('apt-cache policy ereuse.org-desktopapp | grep -w "Installed: (none)"', (_, output) => {
        const ver = output.split(':')[1].trim()
        expect(ver).contains(version)})


      // todo We need to change user to root
      spawn('sudo', ['../resources/after-install/add-to-crontab.sh "*/1 * * * *" "localhost:3000"'])
      setTimeout(function afterCron () {
        // We test that the app has been updated successfully
        exec('apt-cache policy ereuse.org-desktopapp | grep Installed', (_, stdout) => {
          const appVersion = stdout.split(':')[1].trim()
          expect(appVersion).equal(version)
          done()
        })
      }, 3 * 1000)  // We suppose that cron will execute before 3 secs
    })
    //let's ensure the app is installed


  })
  it('updater without cron, execute updaterBackground', function (done) {
    const update = require('./../resources/updaterBackground.js')
    const baseUrl = 'http://localhost:3000'
    update(baseUrl, baseUrl).then(function (code) {
      expect(parseInt(code)).equal(0)
      exec('apt-cache policy ereuse.org-desktopapp | grep -w "Installed:"', (_, out) => {
        // We double check we have correctly uninstalled the app
        expect(out).contains('none')
        done()
      })
    })
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
    // Use the following command if the server ends up running in port
    // It will kill the server
    // exec('kill $(lsof -t -i:3000')
  })
})