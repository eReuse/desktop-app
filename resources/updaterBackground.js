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
  const urlDeviceHub = configEnv.url || 'http://devicehub.ereuse.net'
  DeviceHub.get(urlDeviceHub + '/desktop-app').then(response => {
    _.merge(configEnv, response)
    let path = '/opt/MyeReuse.org_Support/resources/.env.json' // todo take path auto
    fs.writeFileSync(path, JSON.stringify(configEnv), 'utf-8', function(err) {
      if (err) throw err
    })
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
    const pathDeb = urlDeviceHub + file.url
    if (semver.gt(appInfo.version, localVersion)) {
      console.log('New version ' + appInfo.version + '.')
      DeviceHub.get(pathDeb, true).then(function install(response) {
        const path = os.tmpdir() + installer
        fs.writeFileSync(path, response, {encoding: 'binary'})
        console.log('Installing...')
        spawn('gdebi', ['--n', path]).on('exit', function () {
          console.log('Installation finished ' + now())
        })
      }).catch(err => {
        console.error(err)
        console.log('error getDeb:' + err)
      })
    } else {
      console.log('There is not an update (your version: ' + localVersion + ', repo version: ' + appInfo.version + ').')
    }
  }).catch(err => {
    console.log('There is an error, couldn\'t get desktop-app info')
    console.error(err)
  })
  // Execution starts and finished in the same time??
  console.log('Execution finished at ' + now() + '\n')
}

// grep "Instaŀlat:" change depends on which language | now is catalan version
function getLocalVersion () {
  const command = 'apt-cache policy ereuse.org-desktopapp | grep "Insta"'
  const localVersion = execSync(command, EXEC_ENCODING).split(':')[1].trim()
  return semver.valid(localVersion) ? localVersion : '0.0.0'
}

module.exports = updateIfNewerVersion
