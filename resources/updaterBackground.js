const {spawn, exec} = require('child_process')
const semver = require('semver')
const rp = require('request-promise')

const githubMeta = {
  name: null,
  version: null, // todo get this from app
  arch: process.arch,
  platform: process.platform
}

const localMeta = {
  version: '1.0.0'
}

let optionsJson = {
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
  let tag = githubMeta.platform + '-' + githubMeta.arch + '-' + githubMeta.version //todo publish with tag=linux-x64-1.0.0
  let installer = githubMeta.name + '_' + githubMeta.version + '.deb' // installer: eReuse.org-DesktopApp_1.0.0.deb
  let urlRelease = 'https://github.com/eReuse/desktop-app/releases/download/' + tag + '/' + installer
  if (!semver.gt(githubMeta.version, localMeta.version)) {
    console.log('You have the last version ' + githubMeta.version + ' el local version es: ' + localMeta.version )
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
