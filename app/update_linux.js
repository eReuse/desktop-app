// const remote = require('electron')
const semver = require('semver')
const rp = require('request-promise')
const spawn = require('child_process').spawn

const meta = {
  urlUpdater: 'https://github.com/eReuse/desktop-app/releases/download/1.0.0/eReuse.org-DesktopApp_1.0.0.deb',
  name: 'eReuse.org-DesktopApp',
  version: 'v1.0.0',
  arch: process.arch,
  platform: process.platform
}

console.log(process.platform)

let tag = meta.platform + '-' + meta.arch + '-' + meta.version
let urlRelease = 'https://github.com/eReuse/desktop-app/releases/download/' + tag + '/' + meta.name + '_' + meta.version + '.deb'

console.log(urlRelease)

let optionsJson = {
  uri: 'https://raw.githubusercontent.com/eReuse/desktop-app/master/package.json',
  /*
  qs: {
    access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
  }, */
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
}


function downloadRelease  () {
  let release = spawn('wget', [urlRelease])

  release.on('exit', () => {
    console.log(`Child exited wget finished`)
    // catchJSON()
  })
}

function getJson (versionA) {
  return rp(optionsJson).then(infojson => {
    let needUpdate = semver.gt(infojson.version, versionA)
    downloadRelease()
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  getJson: getJson
}
