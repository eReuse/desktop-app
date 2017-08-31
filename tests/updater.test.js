const chai = require('chai')
const fs = require('fs')


process.env.NODE_ENV = 'testing'

describe('test updater', function () {
  let returnVersion, returnDeb

  function uninstallApp () {
    exec('')
  }

  beforeAll(function startMockServer () {
    // express
    const express = require('express')
    const app = express()

    app.get('/eReuse/desktop-app/master/package.json', returnVersion)

    app.get('/eReuse/desktop-app/releases/download/linux-x64-0.1.1/eReuse.org-DesktopApp_0.1.1_x64.deb', returnDeb)

    app.listen(3000, function () {
      console.log('Example app listening on port 3000!')
    })
  })

  beforeEach(uninstallApp)

  it('updates when there is a newer version', function (done) {
    const version = '0.1.1'
    returnVersion = function (req, res) {
      res.send(JSON.stringify({
        version: version
      }))
    }
    returnDeb = function (req, response) {
      const file = fs.readFile('./fixtures/eReuse.org-DesktopApp_' + version + '_x64.deb')
      // Check if file specified by the filePath exists
      fs.exists(file, function(exists){
        if (exists) {
          // Content-type is very interesting part that guarantee that
          // Web browser will handle response in an appropriate manner.
          response.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition' : 'attachment; filename=' + file})
          fs.createReadStream(file).pipe(response)
        } else {
          response.writeHead(400, {'Content-Type': 'text/plain'})
          response.end('ERROR File does NOT Exists')
        }
      })
    }
    // We install a lower version
    exec('sudo apt-get install')

    // todo We need to change user to root
    exec('../scripts/after-install/add-to-crontab.sh "*/1 * * * *" "localhost:3000"')
    timeout(function () {
      // We test that the app has been updated successfully
      let appVersion = null
      exec('apt-cache version', stdout => {
        console.log(`stdout: ${stdout}`)
        appVersion = stdout
      })
      expect(appVersion).equal(version)
      // We run the app to know if everything was installed correctly
      done()
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

  afterAll(function () {
    // close server
  })
})