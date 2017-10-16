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
  const urlDevicehub = configEnv.url + '/desktop-app' || 'http://devicehub.ereuse.net/desktop-app'
  DeviceHub.get(urlDevicehub).then(response => {
    _.merge(configEnv, response)
    // fs.writeFileSync(path, response)
    const appInfo = {
      name: 'eReuse.org-DesktopApp',
      version: configEnv.version,
      arch: process.arch, // todo only accept ia32 or x64??
      platform: process.platform
    }
    console.log(os.arch())
    console.dir(appInfo)
    if (semver.gt(appInfo.version, localVersion)) {
      console.log('New version ' + version + '.')
      let typeFile = ''
      if (appInfo.platform === 'linux') {
        typeFile = 'deb'
      }
      const files = configEnv.files
      const file = _.find(files, {type: typeFile, architecture: appInfo.arch})
      const pathDeb = configEnv.url + file.url
      const headers = {
        'Accept': '*/*',
      }
      DeviceHub.get(pathDeb, headers).then(function (response) {
        const path = os.tmpdir() + '/' + 'Desktop-app.' + typeFile
        fs.writeFileSync(path, response)

        console.log('Installing...')
        spawn('gdebi', ['--n', path]).on('exit', function () {
          console.log('Installation finished ' + now())
        })
      }).catch(reject)
    } else {
      console.log('There is not an update (your version: ' + localVersion + ', repo version: ' + appInfo.version + ').')
    }
  }).catch(err)
  {
    console.error(err)
    console.error('There is an error, couldn\'t ...')
  }
  console.log('Execution finished at ' + now() + '\n')
}

// grep "Instaŀlat:" change depends on which language

function getLocalVersion () {
  const command = 'apt-cache policy ereuse.org-desktopapp | grep "Insta"'
  const localVersion = execSync(command, EXEC_ENCODING).split(':')[1].trim()
  return semver.valid(localVersion) ? localVersion : '0.0.0'
}

module.exports = updateIfNewerVersion
