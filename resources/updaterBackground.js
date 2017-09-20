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

function now() {
  return (new Date()).toUTCString()
}

function updateIfNewerVersion (baseUrl, baseRawUrl, branch, arch, version) {

  console.log('Execution starts in ' + now() + '\n')
  baseUrl = baseUrl || 'https://github.com'
  baseRawUrl = baseRawUrl || 'https://raw.githubusercontent.com'
  branch = branch || 'master'
  const localVersion = version || getLocalVersion()
  const optionsJson = {
    // github does not honor Accept: application/json
    uri: baseRawUrl + '/eReuse/desktop-app/' + branch +'/package.json',
  }

// get last packages.json version
  return new Promise(function (fulfill, reject) {
    rp(optionsJson).then(function getLastPackageVersion (json) {
      const infoApp = JSON.parse(json)
      const app = {
        name: infoApp.name,
        version: infoApp.version, // todo get this from app
        arch: arch || process.arch, // ia32 or x64
        platform: process.platform
      }
      if (semver.gt(app.version, localVersion)) {
        console.log('New version ' + app.version + '.')

        // todo publish with tag=linux-1.0.0
        const tag = app.platform + '-' + app.version
        const installer = '/' + app.name + '_' + app.version + '_' + app.arch + '.deb'

        const reqDeb = {
          uri: baseUrl + '/eReuse/desktop-app/releases/download/' + tag + installer,
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
}

// grep "Instaŀlat:" change depends on which language

function getLocalVersion () {
  const command = 'apt-cache policy ereuse.org-desktopapp | grep "Insta"'
  const localVersion = execSync(command, EXEC_ENCODING).split(':')[1].trim()
  return semver.valid(localVersion) ? localVersion : '0.0.0'
}

module.exports = updateIfNewerVersion
