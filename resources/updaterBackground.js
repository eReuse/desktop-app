#!/usr/local/bin/nodejs

const {spawn, execSync}  = require('child_process')
const semver = require('/usr/local/lib/node_modules/semver') // /usr/local/lib/node_modules/semver/bin/semver
const rp = require('/usr/local/lib/node_modules/request-promise')

const githubMeta = {
  name: null,
  version: null, // todo get this from app
  arch: process.arch,
  platform: process.platform
}
const baseUrl = process.argv[2] || 'https://github.com'
const baseRawUrl = process.argv[2] || 'https://raw.githubusercontent.com'
// Automatitzar la version actual
const localVersion = '0.0.1' // todo fix automatic localversion

const optionsJson = {
  uri: baseRawUrl + '/eReuse/desktop-app/master/package.json',
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
  var installer = githubMeta.name + '_' + githubMeta.version + '_' + githubMeta.arch + '.deb' // installer: eReuse.org-DesktopApp_1.0.0_x64.deb
  var urlRelease = baseUrl + '/eReuse/desktop-app/releases/download/' + tag + '/' + installer
  if (!semver.gt(githubMeta.version, localVersion)) {
    console.log('You have the last version ' + githubMeta.version + ' el local version es: ' + localVersion)
  } else {
    var release = execSync('wget -P /tmp ' + urlRelease)
    release.on('exit', function (code) {
      if(code === 0) {
        var install = spawn('gksudo', ['-k', 'gdebi -n /tmp/' + installer])
        install.on('exit', function (code) {
          console.log('Child exited dpkg finished with code ' + code)
        })
      } else {
        console.log('Child exited wget finished with code ' + code)
      }
    })
  }
}).catch(function (err) {
  console.log(err)
})

module.exports = {
  autoUpdateL: downloadRelease
}