const expect = require('chai').expect
const path = require('path')
const spawnSync = require('child_process').spawnSync
const exec = require('child_process')
const mocha = require('mocha')
const describe = mocha.describe
const {before, after} = require('mocha')
// const {beforeEach, afterEach}= mocha
const it = mocha.it

describe('Test Updater', function () {
  this.timeout(5000)
  let app, server

  let version = '0.1.0' // equal version in fixtures
  let returnEnv = function (req, res) {
    const pathEnv = '/home/nadeu/Documents/WebstormProjects/desktop-app/resources/.env.json'
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    res.sendFile(pathEnv, options)
  }
  const returnDeb = function (req, response) {
    const pathDeb = path.join(__dirname + '/fixtures/eReuse.org-DesktopApp_' + version + '_x64.deb')
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

    app.get('/static/desktop_app/' + 'eReuse.org-DesktopApp_' + version + '_x64.deb',
      (req, response) => returnDeb(req, response))

    server = app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
    })
  })

  //beforeEach(uninstallApp)

  it('updates when there is a newer version', function (done) {
    // this.timeout(0)
    const update = require('./../resources/updaterBackground')
    const baseUrl = 'http://localhost:3000'
    const pathDev = '/home/nadeu/Documents/WebstormProjects/desktop-app/resources/.env.json'
    update(baseUrl, pathDev).then(function (code) {
      //todo then is undefined??
      expect(parseInt(code)).equal(0)
      exec('apt-cache policy ereuse.org-desktopapp | grep -w "Installed:"', (_, out) => {
        // We double check we have correctly uninstalled the app
        expect(out).contains('none')
        done()
      })
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