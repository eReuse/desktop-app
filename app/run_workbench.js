const {remote, ipcRenderer} = require('electron')
const path = require('path')
const fs = require('fs')
const spawn = remote.require('child_process').spawn

/* json read and write
const jsonfile = require('jsonfile')

let srcJson = path.join('/tmp/data.json')
let dist = path.join('/usr/eReuse.org')

jsonfile.readFile(srcJson, function (err, obj) {
   jsonfile.writeFile(dist, obj, function (err) {
   console.error(err)
   })
  console.dir(obj)
}) */

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
    // catchJSON()
  })
}
