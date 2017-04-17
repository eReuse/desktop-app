const electron = require('electron');
const {app,BrowserWindow} = electron;
const updater = require('electron-simple-updater');
//const PythonShell = require('python-shell');

let winMain = null //create main window

updater.init('https://raw.githubusercontent.com/eReuse/desktop-app/master/updates.json'); //check if new version is available

function createWindow() {
	// Create browser window

	winMain = new BrowserWindow({
		width: 800,
		height: 650
	});

	//Load index.html

	winMain.loadURL('file://' + __dirname + '/index.html');

	//Open devtools

	winMain.webContents.openDevTools();

	winMain.on('closed', () => {
		winMain = null;
	});
}

	//Run create windows function
	app.on('ready', createWindow);

	//Quit when all windows are closed
	app.on('window-all-closed', () => {
		app.quit()
	});
/*
PythonShell.run('my_script.py', function (err) {
  if (err) {
    throw err;
  }
  console.log('finished');
});*/