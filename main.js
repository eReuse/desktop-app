const electron = require('electron') //create necessary objects
const {app,BrowserWindow} = electron
const path = require('path')
const url = require('url')

const PythonShell = require('python-shell');

let winMain //create main window

function createWindow() {
	// Create browser window

	winMain = new BrowserWindow({
		width: 800,
		height: 650
	});

	//Load index.html

	winMain.loadURL(url.format({
		pathname: path.join(__dirname, './web/index.html'),
		protocol: 'file:',
		slashes: true
	}));

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

	//Runs python script

PythonShell.run('my_script.py', function (err) {
	if (err) {
		throw err;
	}
	console.log('finished');
});
