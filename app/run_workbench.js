const spawn = require('child_process').spawn
const path = require('path')
const fs = require('fs')
const os = require('os')
const rp = require('request-promise')
const notifier = require('node-notifier')
const varEnv = require('../.env.json')
const deviceHub = require('./server')

// if button click execute erwb

document.getElementById('botoDiag').addEventListener('click', runWorkbench)

function runWorkbench() {
  new Workbench()
}

function showErr (err) {
  console.error(err)
}



class Workbench {
  static runWorkbench()
}

// Docu login and send json http://devicehub.ereuse.org/

let workbench = null

function runWorkbench () {
  workbench = spawn('gksudo', ['-k', 'erwb'])

  workbench.on('exit', () => {
    console.log(`Child exited wb finished`)
    const filePath = os.tmpdir()
    console.log(filePath)
    fs.watch(filePath, { encoding: 'string' }, (eventType, filename) => {
      if (event ==='rename') {
        try {
          const text = fs.readFileSync(filename, 'utf8')
          const snapshot = JSON.parse(text)
          snapshot.software = 'DesktopApp'
        } catch (err) {
          throw //break
        }
        deviceHub.post('events/devices/snapshot', snapshot).then(response => {
          // tot ok el snapshot s'ha creat
          notifier.notify({
            'title': 'Diagnostic',
            'message': 'Snapshot send succesfully'
          })

        }).catch((reponse) => {
          // no ha fet login
          // problema amb snapshot
          // uuid
        })

        if (filename) {
          try {
            snapshot = JSON.parse(filename)
          } catch(err){
            // is not or json
          }
          // si eventType es crea un nou fitxer, comprovar que es .json amb tres , , ,
          // alhora de pujar-lo mirar el uuid si ja existeix al devicehub
          // al final borrar el json un cop enviat ok
          console.log(filename)
        }
      }
    })