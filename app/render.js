const {remote, ipcRenderer} = require('electron')
const {Menu, MenuItem} = remote
const spawn = remote.require('child_process').spawn

const menu = Menu.buildFromTemplate([
  {
    label: 'Electron',
    submenu: [
      {
        label: 'Prefs',
        click: function () {
          ipcRenderer.send('toggle-prefs')
        }
      }
    ]
  }
])

Menu.setApplicationMenu(menu)

// if button click execute erwb

document.getElementById('botoDiag').addEventListener('click', runWorkbench)

/*
let button = document.createElement('button')
button.textContent = 'Diagnostic'
*/

let workbench = null

function runWorkbench () {
  workbench = spawn('gksudo', ['-k', 'erwb --settings /usr/eReuse.org/config1.ini'])

  workbench.on('exit', () => {
    console.log(`Child exited wb finished`)
    catchJSON()
  })
}

// put result JSON in eReuse.org

function catchJSON () {
  console.log('this is catchJSON')
  /*
  list('tmp/*json').forEach(path => {
    const file = open(path)
    const snapshot = json.load(file)
    if ('@type' in snapshot['device']) {
      send().catch(_ => {
        saveToFile(file, 'path/to/save')
      })
      return false
    }
  })
  console.log('Finish catchJSON') */
}
