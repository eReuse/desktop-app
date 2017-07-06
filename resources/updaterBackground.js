#!/usr/local/bin/nodejs

const spawn  = require('child_process').spawn
const exec  = require('child_process').exec
const semver = require('/usr/local/lib/node_modules/semver') // /usr/local/lib/node_modules/semver/bin/semver
const rp = require('/usr/local/lib/node_modules/request-promise')

const githubMeta = {
  name: null,
  version: null, // todo get this from app
  arch: process.arch,
  platform: process.platform
}

// Automatitzar la version actual
const localVersion = '1.0.0' // todo fix automatic localversion

var optionsJson = {
  uri: 'https://raw.githubusercontent.com/eReuse/desktop-app/master/package.json',
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response
}
// get last packages.json version
rp(optionsJson).then(function getLastPackageVersion (infoapp) {
  githubMeta.name = infoapp.name
  githubMeta.version = infoapp.version
  var tag = githubMeta.platform + '-' + githubMeta.arch + '-' + githubMeta.version // todo publish with tag=linux-x64-1.0.0
  var installer = githubMeta.name + '_' + githubMeta.version + '.deb' // installer: eReuse.org-DesktopApp_1.0.0.deb
  var urlRelease = 'https://github.com/eReuse/desktop-app/releases/download/' + tag + '/' + installer
  if (!semver.gt(githubMeta.version, localVersion)) {
    console.log('You have the last version ' + githubMeta.version + ' el local version es: ' + localVersion)
  } else {
    var release = exec('wget -P /tmp ' + urlRelease, function () {
      var install = spawn('gksudo', ['-k', 'dpkg -i /tmp/' + installer])
      install.on('exit', function (code) {
        console.log('Child exited dpkg finished with code ' + code)
      })
    })
    release.on('exit', function (code) {
      console.log('Child exited wget finished with code ' + code)
    })
  }
}).catch(function (err) {
  console.log(err)
})
