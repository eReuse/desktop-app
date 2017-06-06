// const remote = require('electron')
const semver = require('semver')
const rp = require('request-promise')
const spawn = require('child_process').spawn

const meta = {
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

function downloadRelease (versionA) {
  rp(optionsJson).then(infoapp => {
    meta.name = infoapp.name
    meta.version = infoapp.version
    let tag = meta.platform + '-' + meta.arch + '-' + meta.version
    let installer = meta.name + '_v' + meta.version + '.deb'
    let urlRelease = 'https://github.com/eReuse/desktop-app/releases/download/' + tag + '/' + installer
    console.log(urlRelease)
    if (semver.gt(meta.version, versionA)) {
      let release = spawn('wget', ['-P ' + pathDeb + ' ' + urlRelease])
      release.on('exit', () => {
        console.log(`Child exited wget finished`)
        let installdeb = spawn('gksudo', ['-k', 'dpkg -i ' + installer])
        installdeb.on('exit', () => {
          console.log(`Child exited dpkg finished`)
        })
      })
    } else console.log('You have the last version')
  }).catch(err => {
    console.log(err)
  })
}

const pathDeb = '~/.MyeReuse.org_Support/update/'

module.exports = {
  autoUpdateL: downloadRelease
}
