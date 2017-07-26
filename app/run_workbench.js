const { remote } = require('electron')
const spawn = remote.require('child_process').spawn
const path = require('path')
const fs = require('fs')
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

let workbench = null

function runWorkbench () {
  workbench = spawn('gksudo', ['-k', 'erwb'])

  workbench.on('exit', () => {
    console.log(`Child exited wb finished`)
    console.log(process.env.EMAIL_WB)
    console.log(process.env.PASS_WB)
    let jsonDir = path.join(__dirname, 'testwb.json')
    let jsonObj = JSON.parse(fs.readFileSync(jsonDir, 'utf8'))
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
        body: jsonObj,
        json: true
      }
      console.dir(opSnapshot.body)
      rp(opSnapshot).then(responseSnapshot => {
        console.log('snapshot send succesfully')
      }).catch(showErr) // todo show alert when no internet
    }).catch(showErr)
  })
}

/* HOW TO GET JSON FROM DIRECTORY
Sync:
var obj = JSON.parse(fs.readFileSync('file', 'utf8'));

Async:
var obj;
fs.readFile('file', 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
})

EASY WAY USING jsonfile npm module

var jsonfile = require('jsonfile')
var file = '/tmp/data.json'
jsonfile.readFile(file, function(err, obj) {
  console.dir(obj)
}) */



/* Example when handled through fs.watch listener
fs.watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    // si eventType es crea un nou fitxer, comprovar que es .json amb tres , , ,
    // alhora de pujar-lo mirar el uuid si ja existeix al devicehub
    // al final borrar el json un cop enviat ok
    console.log(filename)
  }
}) */
