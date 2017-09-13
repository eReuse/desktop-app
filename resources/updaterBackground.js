#!/usr/bin/nodejs // node 4.2.6
const EXEC_ENCODING = {encoding: 'UTF-8'}

// Change path depends on testing or production
const PATH_NODE_MODULES = '/usr/local/lib/node_modules/'
const LOG = '/tmp/desktop-app-error.txt'

const childProcess = require('child_process')
const fs = require('fs')
const appendFileSync = require('fs').appendFileSync
const semver = require(PATH_NODE_MODULES + 'semver')
const rp = require(PATH_NODE_MODULES + 'request-promise')
const Promise = require(PATH_NODE_MODULES + 'promise')

function now() {
  return (new Date()).toUTCString()
}

function updateIfNewerVersion (baseUrl, baseRawUrl, branch, arch, version) {
  appendFileSync(LOG, 'Execution starts in' + now() + '\n')
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
        platform: process.platform,

      }
      if (semver.gt(app.version, localVersion)) {
        console.log('New version ' + app.version + '.')

        // todo publish with tag=linux-1.0.0
        const tag = app.platform + '-' + app.version
        const installer = app.name + '_' + app.version + '_' + app.arch + '.deb'

        const reqDeb = {
          uri: baseUrl + '/eReuse/desktop-app/releases/download/' + tag + '/' + installer,
          encoding: null
        }
        rp(reqDeb).then(function (response) {
          const path = '/tmp/' + installer
          fs.writeFileSync(path, response)

          console.log('Installing...')
          const stdout = childProcess.execSync('gdebi --n ' + path, EXEC_ENCODING)
          if (!stdout.includes('Done')) reject('Couldn\'t install: ' + stdout)
        }).catch(reject)
      } else {
        console.log('There is not an update (your version: ' + localVersion + ', repo version: ' + app.version + ').')
      }
    }).catch(reject)
  }).catch(function (err) {
    console.error('There is an error, check the log in ' + LOG)
    appendFileSync(LOG, err)
  }).finally(function () {
    appendFileSync(LOG, 'Execution finished at ' + now() + '\n')
  })
}

// grep "Instaŀlat:" change depends on which language

function getLocalVersion () {
  const command = 'apt-cache policy ereuse.org-desktopapp | grep "Insta"'
  const localVersion = childProcess.execSync(command, EXEC_ENCODING).split(':')[1].trim()
  return semver.valid(localVersion) ? localVersion : '0.0.0'
}

module.exports = updateIfNewerVersion
