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
const configEnv = require('../.env.json')

function now() {
  return (new Date()).toUTCString()
}

function updateIfNewerVersion() {
  const localVersion = getLocalVersion()
  console.log('Execution starts in ' + now() + '\n')
  const urlDevicehub = configEnv.url || 'http://devicehub.ereuse.net/desktop-app'
  DeviceHub.get(urlDevicehub).then(response => {
    _.merge(configEnv, response)
    const app = {
      name: 'eReuse.org-DesktopApp',
      version: configEnv.version, // todo get this from app
      arch: process.arch || os.arch(), // todo only accept ia32 or x64??
      platform: process.platform
    }

    const typeFile = process.platform + '-' + process.arch
    console.log(process.arch) // 'arm', 'ia32', or 'x64'
    console.log(process.platform) // 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
    console.log(os.arch())

    if (semver.gt(app.version, localVersion)) {
      console.log('New version ' + configEnv.version + '.')
      const installer = app.name + '_' + app.version + '_' + app.arch + '.deb'
      const files = configEnv.files
      let result = _.find(files, ['name', installer])
      const pathDeb = configEnv.url + result.file + result.name
      const headers = {
        'Accept': 'application/octet-stream',
        'content-type': result.content_type
      }
      DeviceHub.get(pathDeb, headers).then(function (response) {
        const path = os.tmpdir() + '/' + installer
        fs.writeFileSync(path, response)

        console.log('Installing...')
        spawn('gdebi', ['--n', path]).on('exit', function () {
          console.log('Installation finished ' + now())
        })
      }).catch(reject)
    } else {
      console.log('There is not an update (your version: ' + localVersion + ', repo version: ' + app.version + ').')
    }
  }).catch(err)
  {
    console.error(err)
    console.error('There is an error, check the log in /var/log/..')
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
