const { remote } = require('electron')
const path = require('path')
const spawn = remote.require('child_process').spawn
const rp = require('request-promise')
const dotenv = require('dotenv').config()

// if button click execute erwb

document.getElementById('botoDiag').addEventListener('click', runWorkbench)

/*
 let button = document.createElement('button')
 button.textContent = 'Diagnostic'
 */
function showErr (err) {
  console.error(err)
}

// Docu login and send json http://devicehub.ereuse.org/

function sendJsonToDeviceHub () {
  let jsonObject = path.join(__dirname, '/resources/testwb.json')
  console.dir(jsonObject) // no pilla el json correcte
  let opLogin = {
    method: 'POST',
    uri: 'http://devicehub.ereuse.net/login',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: {
      email: process.env.EMAIL_DH,
      password: process.env.PASS_DH
    },
    json: true // Automatically stringifies the body to JSON
  }

  rp(opLogin).then(loginPost => {
    let tokenDh = loginPost.token
    let dbName = loginPost.defaultDatabase
    let opSnapshot = {
      method: 'POST',
      uri: 'http://devicehub.ereuse.net/' + dbName + '/events/devices/snapshot',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + tokenDh
      },
      body: JSON.stringify({jsonObject})
    }
    rp(opSnapshot).then(responseSnapshot => {
      console.log('snapshot send succesfully')
    }).catch(showErr) // todo show alert when no internet
  }).catch(showErr)
}

let workbench = null

function runWorkbench () {
  workbench = spawn('gksudo', ['-k', 'erwb --settings /usr/eReuse.org/config1.ini'])

  workbench.on('exit', () => {
    console.log(`Child exited wb finished`)
    console.log(process.env.EMAIL_WB)
    console.log(process.env.PASS_WB)
    sendJsonToDeviceHub()
  })
}

/* Example when handled through fs.watch listener
fs.watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    // si eventType es crea un nou fitxer, comprovar que es .json amb tres , , ,
    // alhora de pujar-lo mirar el uuid si ja existeix al devicehub
    // al final borrar el json un cop enviat ok
    console.log(filename)
  }
}) */
