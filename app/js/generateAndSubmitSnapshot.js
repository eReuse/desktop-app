const spawnSync = require('child_process').spawnSync
const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')
const os = require('os')
const notifier = require('node-notifier')
const DeviceHub = require('../../resources/devicehub')
const version = require('../../resources/.env.json').version
// Documentation login and send json http://devicehub.ereuse.org/

function generateAndSubmitSnapshot () {
  // spawnSync('gksudo', ['-k', '/opt/MyeReuse.org_Support/eReuse.org-Workbench/workbench/scripts/erwb-devel'])
  // spawnSync('sudo erwb')
  console.log('Child exited wb finished')
  const filePath = path.join(os.tmpdir(), '*.json')
  chokidar.watch(filePath).on('add', path => {
    let snapshot
    try {
      const text = fs.readFileSync(path, 'UTF-8')
      snapshot = JSON.parse(text)
      snapshot.snapshotSoftware = 'DesktopApp'
      snapshot.versionDesktopApp = version || '0.1.0' //todo take automatically local version
    } catch (err) {
      console.error(err)
      return
    }
    DeviceHub.post('events/devices/snapshot', snapshot).then(response => {
      // tot ok el snapshot s'ha creat
      console.log('Snapshot send successfully')
      notifier.notify({
        'title': 'Diagnostic',
        'message': 'Snapshot send successfully ' + response
      })
    }).catch((err) => {
      console.error(err)
      notifier.notify({
        'title': 'Diagnostic',
        'message': 'Snapshot is not send correctly'
      })
      // todo error controls (no login, problems with snapshot, uuid check, etc..)
    })
  })
}

module.exports = generateAndSubmitSnapshot