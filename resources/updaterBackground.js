/** Node.js Script
 *  Search and Find a new update
 *  Get env.json to devicehub (config and new version info) and compare with local version, -
 *  -> Download from DeviceHub release and install deb package
 */

const EXEC_ENCODING = {encoding: 'UTF-8'}

const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const fs = require('fs')
const os = require('os')
const semver = require('semver')
const _ = require('lodash')
const DeviceHub = require('./devicehub')
const configEnv = require('./.env.json')

function now() {
  return (new Date()).toUTCString()
}

function updateIfNewerVersion() {
  const localVersion = getLocalVersion()
  console.log('Execution starts in ' + now() + '\n')
  const urlDevicehub = configEnv.url || 'http://devicehub.ereuse.net'
  DeviceHub.get(urlDevicehub + '/desktop-app').then(response => {
    //after .get jump to catch and finish script, then return to this comment??
    _.merge(configEnv, response)
    // fs.writeFileSync(path, response) //keep info in env?
    const appInfo = {
      name: 'eReuse.org-DesktopApp',
      version: configEnv.version,
      arch: process.arch, // todo only accept ia32 or x64??
      platform: process.platform
    }
    const files = configEnv.files
    let file = null
    let typeFile = null
    if (appInfo.platform === 'linux') {
      typeFile = 'deb'
      file = _.find(files, {type: typeFile, architecture: appInfo.arch})
    }
    const installer = '/' + appInfo.name + '_' + appInfo.version + '_' + appInfo.arch + '.' + typeFile
    //else if (win) type = 'exe'
    const pathDeb = urlDevicehub + file.url
    const headers = {
      'Accept': '*/*',
    }
    if (semver.gt(appInfo.version, localVersion)) {
      console.log('New version ' + version + '.')
      DeviceHub.get(pathDeb, headers).then(function (response) {
        const path = os.tmpdir() + installer
        fs.writeFileSync(path, response)
        console.log('Installing...')
        spawn('gdebi', ['--n', path]).on('exit', function () {
          console.log('Installation finished ' + now())
        })
      }).catch()
    } else {
      console.log('There is not an update (your version: ' + localVersion + ', repo version: ' + appInfo.version + ').')
    }
  }).catch()
  {
    console.log('There is an error, couldn\'t get desktop-app info')
  }
  console.log('Execution finished at ' + now() + '\n')
}

// grep "Instaŀlat:" change depends on which language | now is catalan version
function getLocalVersion () {
  const command = 'apt-cache policy ereuse.org-desktopapp | grep "Insta"'
  const localVersion = execSync(command, EXEC_ENCODING).split(':')[1].trim()
  return semver.valid(localVersion) ? localVersion : '0.0.0'
}

module.exports = updateIfNewerVersion ()
