// const remote = require('electron')
const semver = require('semver')
const rp = require('request-promise')
const spawn = require('child_process').spawn

const meta = {
  urlUpdater: null,
  name: null,
  version: null,
  arch: process.arch,
  platform: process.platform
}

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

function getJson () {
  rp(optionsJson).then(infojson => {
    meta.name = infojson.name
    meta.version = infojson.version
  }).catch(err => {
    console.log(err)
  })
}

const tag = meta.platform + '-' + meta.arch + '-' + meta.version
const installer = meta.name + '_' + meta.version + '.deb'
let urlRelease = 'https://github.com/eReuse/desktop-app/releases/download/' + tag + '/' + installer
meta.urlUpdater = urlRelease

const pathDeb = '~/.MyeReuse.org_Support/update/'

console.log(urlRelease)

function downloadRelease(versionA) {
  getJson()
  if (semver.gt(meta.version, versionA)) {
    let release = spawn('wget', ['-P '+pathDeb+urlRelease])
    release.on('exit',() => {
      console.log(`Child exited wget finished`)
      let installdeb = spawn('gksudo', ['-k', 'dpkg -i '+installer])
      installdeb.on('exit', () => {
        console.log(`Child exited dpkg finished`)
      })
    })
  }
  else console.log('You have the last version')
}

module.exports = {
  getJson: getJson,
  autoUpdateL: downloadRelease
}
