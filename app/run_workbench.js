// const { remote } = require('electron')
const spawn = require('child_process').spawn
const path = require('path')
const fs = require('fs')
const rp = require('request-promise')
const notifier = require('node-notifier')
const dotenv = require('dotenv').config()

// if button click execute erwb

document.getElementById('botoDiag').addEventListener('click', runWorkbench)

function showErr (err) {
  console.error(err)
}

// Docu login and send json http://devicehub.ereuse.org/

let workbench = null

function runWorkbench () {
  workbench = spawn('gksudo', ['-k', 'erwb --settings /usr/eReuse.org/config1.ini'])

  workbench.on('exit', () => {
    console.log(`Child exited wb finished`)
    //let jsonDir = path.join(__dirname, 'testwb.json')
    // console.log(jsonDir)
    //let jsonObj = JSON.parse(fs.readFileSync(jsonDir, 'utf8'))
    let jsonObj = JSON.parse(fs.readFileSync('/opt/MyeReuse.org_Support/resources/testwb.json', 'utf8'))
    console.dir(jsonObj)
    let opLogin = {
      method: 'POST',
      uri: 'http://devicehub.ereuse.net/login',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: {
        email: 'a@a.a',
        password: '1234'
      },
      json: true // Automatically stringifies the body to JSON
    }
    rp(opLogin).then(loginPost => {
      let tokenDh = loginPost.token
      let dbName = loginPost.defaultDatabase
      console.dir(tokenDh)
      console.log(dbName)
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
        console.log('Snapshot send succesfully')
        notifier.notify({
          'title': 'Diagnostic',
          'message': 'Snapshot send succesfully'
        })
      }).catch(showErr) // todo show alert when no internet
    }).catch(showErr)
  })
}

/*
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
