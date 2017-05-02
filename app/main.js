const electron = require('electron');
const {app,BrowserWindow} = electron;
const updater = require('electron-simple-updater');
//const PythonShell = require('python-shell');

let winMain = null //create main window

//check if new version is available
updater.init({
  autoDownload: true,
  checkUpdateOnStart: true,
	url: 'https://raw.githubusercontent.com/eReuse/desktop-app/master/updates.json'
});

function createWindow() {
	// Create browser window

	winMain = new BrowserWindow({
		show: false,
		width: 1024,
		height: 728
	});

	//Load index.html

	winMain.loadURL('file://' + __dirname + '/index.html');

  winMain.webContents.on('did-finish-load', () => {
    winMain.show();
    winMain.focus();
  });

	//Open devtools

	//winMain.webContents.openDevTools();

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