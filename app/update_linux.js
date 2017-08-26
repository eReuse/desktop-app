const {spawn, exec} = require('child_process')
const semver = require('semver')
const rp = require('request-promise')
const notifier = require('node-notifier')

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
    let tag = meta.platform + '-' + meta.arch + '-' + meta.version // linux-x64-1.0.0
    let installer = meta.name + '_' + meta.version + '_' + meta.arch + '.deb'
    let urlRelease = 'https://github.com/eReuse/desktop-app/releases/download/' + tag + '/' + installer
    if (!semver.gt(meta.version, versionA)) {
      console.log('You have the last version')
    } else {
      let release = spawn('wget', ['-P /tmp ' + urlRelease])
      release.on('exit', (code) => {
        if (code === 1) {
          let install = spawn('gksudo', ['-k', 'dpkg -i /tmp/' + installer])
          install.on('exit', (code) => {
            console.log('Child exited dpkg finished with code ' + code)
            if (code === 1) {
              notifier.notify({
                'title': 'Updater',
                'message': 'Your app is updating, pls restart for new version!'
              })
            } else {
              notifier.notify({
                'title': 'Updater',
                'message': 'Your app could not download the new version!'
              })
            }
          })
        } else {
          console.log('Child exited wget finished with code ' + code)
        }

        })
    }
  }).catch(err => {
    console.error(err)
  })
}

module.exports = {
  autoUpdateL: downloadRelease
}