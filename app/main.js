const electron = require('electron'); //create necessary objects
const {app,BrowserWindow} = electron;
const updater = require('electron-simple-updater');

let winMain //create main window

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
