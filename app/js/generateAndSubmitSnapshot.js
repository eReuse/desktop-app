const spawnSync = require('child_process').spawnSync
const notifier = require('node-notifier')
const DeviceHub = require('../../resources/devicehub')
// Documentation login and send json http://devicehub.ereuse.org/

function generateAndSubmitSnapshot () {
  //let result = spawnSync('sudo erwb --json')
  let result = spawnSync('gksudo', ['-k', 'erwb --json'])
  // let result = spawnSync('gksudo', ['-k', 'erwb', '--smart short' ,'--json'])
  console.log('Child exited wb finished')
  let snapshot = JSON.parse(result.stdout)
  console.log(snapshot)
  snapshot.snapshotSoftware = 'DesktopApp'
  DeviceHub.post('/events/devices/snapshot', snapshot).then(response => {
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
}

module.exports = generateAndSubmitSnapshot