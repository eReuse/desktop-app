/** Node.js Script
 *  Search and Find a new update
 *  Get package.json to github (new version) and compare with local version, -
 *  -> Download from github release and install deb package
 */

const EXEC_ENCODING = {encoding: 'UTF-8'}

const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const fs = require('fs')
const os = require('os')
const semver = require('semver')
const rp = require('request-promise')
const Promise = require('promise')
const config = require('../config.json') //path absolute?

function now() {
  return (new Date()).toUTCString()
}

console.log('Execution starts in ' + now() + '\n')

const localVersion = version || getLocalVersion()
const optionsJson = {
  ContentType: '',
  Accept: 'application/json',
  uri: config.DeviceHub + '/desktop-app/',
  json: true
}

// get last packages.json version
return new Promise(function (fulfill, reject) {
  rp(optionsJson).then(function getLastPackageVersion (json) {
    const infoApp = JSON.parse(json) // Is necessary ??
    const app = {
      name: infoApp.name,
      version: infoApp.version || config.Version, // todo get this from app
      arch: os.arch() || process.arch, // x32 or x64
      platform: process.platform
    }
    //todo change arch to x32 or x64 depends which variant
    // 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64', and 'x86'
    if (semver.gt(app.version, localVersion)) {
      console.log('New version ' + app.version + '.')

      // todo publish with tag=linux-0.1.0
      //const tag = app.platform + '-' + app.version
      const installer = '/' + app.name + '-' + app.version + '-' + app.arch + '.deb'

      const reqDeb = {
        uri: config.App + installer,
        encoding: null
      }
      rp(reqDeb).then(function (response) {
        const path = os.tmpdir() + installer
        fs.writeFileSync(path, response)

        console.log('Installing...')
        spawn('gdebi',['--n',path]).on('exit', function () {
          console.log('Installation finished ' + now())
        })
      }).catch(reject)
    } else {
      console.log('There is not an update (your version: ' + localVersion + ', repo version: ' + app.version + ').')
    }
  }).catch(reject)
}).catch(function () {
  console.error('There is an error, check the log in /var/log/..')
}).finally(function () {
  console.log('Execution finished at ' + now() + '\n')
})

// grep "Instaŀlat:" change depends on which language

function getLocalVersion () {
  const command = 'apt-cache policy ereuse.org-desktopapp | grep "Insta"'
  const localVersion = execSync(command, EXEC_ENCODING).split(':')[1].trim()
  return semver.valid(localVersion) ? localVersion : '0.0.0'
}

module.exports = updateIfNewerVersion
