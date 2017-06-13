// const remote = require('electron')
const {spawn, exec} = require('child_process')
const semver = require('semver')
const rp = require('request-promise')

const meta = {
  name: null,
  version: null,
  arch: process.arch,
  platform: process.platform
}

function downloadRelease (versionA) {
  let optionsJson = {
    uri: 'https://raw.githubusercontent.com/eReuse/desktop-app/master/package.json',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  }
  // get last packages.json version
  rp(optionsJson).then(infoapp => {
    meta.name = infoapp.name
    meta.version = infoapp.version
    let tag = meta.platform + '-' + meta.arch + '-' + meta.version
    let installer = meta.name + '_' + meta.version + '.deb'
    let urlRelease = 'https://github.com/eReuse/desktop-app/releases/download/' + tag + '/' + installer
    if (!semver.gt(meta.version, versionA)) {
      console.log('You have the last version')
    } else {
      let release = exec('wget -P /tmp ' + urlRelease, () => {
        let install = spawn('gksudo', ['-k', 'dpkg -i /tmp/' + installer])
        install.on('exit', (code) => {
          console.log('Child exited dpkg finished with code ' + code)

        })
      })
      release.on('exit', (code) => {
        console.log('Child exited wget finished with code ' + code)
      })
    }
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  autoUpdateL: downloadRelease
}
