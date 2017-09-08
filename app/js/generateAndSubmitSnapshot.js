const execSync = require('child_process').execSync
const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')
const os = require('os')
const notifier = require('node-notifier')
const DeviceHub = require('../server')

// Documentation login and send json http://devicehub.ereuse.org/

function generateAndSubmitSnapshot () {
  execSync('gksudo -k /opt/MyeReuse.org_Support/eReuse.org-Workbench/workbench/scripts/erwb-devel')
  console.log('Child exited wb finished')
  const filePath = path.join(os.tmpdir(), '*.json')
  chokidar.watch(filePath).on('add', path => {
    let snapshot
    try {
      const text = fs.readFileSync(path, 'UTF-8')
      snapshot = JSON.parse(text)
      snapshot.snapshotSoftware = 'DesktopApp'
    } catch (err) {
      console.error(err)
      return
    }
    DeviceHub.post('events/devices/snapshot', snapshot).then(response => {
      // tot ok el snapshot s'ha creat
      notifier.notify({
        'title': 'Diagnostic',
        'message': 'Snapshot send successfully'
      })
    }).catch((err) => {
      console.error(err)
      // no ha fet login
      // problema amb snapshot
      // uuid check errors
    })
  })
}

module.exports = generateAndSubmitSnapshot