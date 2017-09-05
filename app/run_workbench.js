const spawn = require('child_process').spawn
const fs = require('fs')
const os = require('os')
const notifier = require('node-notifier')
const DeviceHub = require('./server')

// if button click execute erwb

document.getElementById('botoDiag').addEventListener('click', runWorkbench)

// Docu login and send json http://devicehub.ereuse.org/

let workbench = null

function runWorkbench () {
  workbench = spawn('gksudo', ['-k', '/opt/MyeReuse.org_Support/eReuse.org-Workbench/workbench/scripts/erwb-devel'])

  workbench.on('exit', () => {
    console.log('Child exited wb finished')
    const filePath = os.tmpdir()
    console.log(filePath)
    fs.watch(filePath, (eventType, filename) => {
      if (eventType === 'rename') {
        let snapshot
        try {
          const text = fs.readFileSync(filename, 'utf8')
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
          console.dir(response)
        }).catch((err) => {
          console.dir(err)
          // no ha fet login
          // problema amb snapshot
          // uuid
        })
      }
    })
  })
}