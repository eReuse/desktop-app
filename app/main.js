const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')
const url = require('url')
const updater = require('electron-simple-updater')
const PythonShell = require('python-shell')

let winMain = null // create main window

// check if new version is available, download and install it
updater.init()

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

  // wait all are ready to show
  winMain.webContents.on('did-finish-load', () => {
    winMain.show()
    winMain.focus()
  })

  // Open devtools

  //winMain.webContents.openDevTools();

  winMain.on('closed', () => {
    winMain = null
  })
}

// Run create windows function
app.on('ready', createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit()
})

PythonShell.run('my_script.py', {pythonPath: 'python3'}, (err,results) => {
  if (err) {
    throw err
  }
  //console.log(results)
  console.log('finished')
})
