const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const username = require('username')
const dotenv = require('dotenv').config()
const updateLinux = require('./update_linux')
const notifier = require('node-notifier')

let winMain = null // create main window
let version = app.getVersion()

username().then(username => {
  console.log(username)
  notifier.notify({
    'title': 'DesktopApp',
    'message': 'Your user is ' + username
  })
  // document.getElementById('user').textContent(username)
})

/*
updater.on('update-downloaded', (event) => {
  exec('pip install -U git+https://github.com/Garito/workbench.git')
}) */

// check if new version is available, download and install it

updateLinux.autoUpdateL(version)

function createWindow () {
  // Create browser window

  winMain = new BrowserWindow({
    width: 1024,
    height: 728,
    minWidth: 720,
    minHeight: 400,
    backgroundColor: '#c3c3c3',
    show: false
  })

  // Load index.html
  winMain.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // wait all DOM are ready to show
  winMain.webContents.on('did-finish-load', () => {
    winMain.show()
    winMain.focus()
  })

  // Open devtools

  winMain.webContents.openDevTools()

  winMain.on('closed', () => {
    winMain = null
  })
}

// Run create windows function
app.on('ready', () => {
  createWindow()
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit()
})
