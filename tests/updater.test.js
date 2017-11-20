const expect = require('chai')
const path = require('path')
const spawnSync = require('child_process').spawnSync
const execSync = require('child_process').execSync
const mocha = require('mocha')
const describe = mocha.describe
const {before, after} = require('mocha')
// const {beforeEach, afterEach}= mocha
const it = mocha.it

describe('Test Updater', function () {
  this.timeout(5000)
  let app, server

  let version = '0.1.0' // equal version in fixtures
  let installer = 'eReuse.org-DesktopApp_' + version + '_x64.deb'
  const pathDeb = path.join(__dirname + '/fixtures/' + installer)
  let returnEnv = function (req, res) {
    const response = require('./../resources/.env')
    res.json(response)
  }
  const returnDeb = function (req, response) {
    const options = {
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/octet-stream'
      }
    }
    response.sendFile(pathDeb, options)
  }

  function uninstallApp (done) {
    spawnSync('sudo', ['../scripts/uninstallApp.sh'])
  }

  before(function startMockServer () {
    // express
    const express = require('express')
    app = express()
    app.get('/desktop-app', (req, response) => returnEnv(req, response))

    app.get('/static/desktop_app/' + installer,
      (req, response) => returnDeb(req, response))

    server = app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
    })
  })

  //beforeEach(uninstallApp)

  it('updates when there is a newer version', function (done) {
    this.timeout(60 * 1000)
    const updateIfNewerVersion = require('./../resources/updaterBackground').updateIfNewerVersion
    const baseUrl = 'http://localhost:3000'
    const pathEnv = '/home/nadeu/Documents/WebstormProjects/desktop-app/resources/.env.json'
    updateIfNewerVersion(baseUrl, pathEnv).then(function (response) {
      expect(response.version).equals(version)
      let out = execSync('apt-cache policy ereuse.org-desktopapp | grep -w "Installed:"')
      expect(out).contains(version)
      done()
    }).catch(err => {
      expect(false).equals(true)
    })
  })

  //afterEach(uninstallApp)

  after(function () {
    // close server
    server.close()
    // Use the following command if the server ends up running in port
    // It will kill the server
    // exec('kill $(lsof -t -i:3000')
  })
})