'use strict';
const electron = require('electron');

const app = electron.app;

const PythonShell = require('python-shell');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1000,
		height: 800
	});

	win.loadURL(`file://${__dirname}/web/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});



let options = {
	mode: 'text',
	pythonPath: './python',
	pythonOptions: ['-u'],
	scriptPath: '/scripts',
};

PythonShell.run('my_script.py', options, function (err, results) {
	if (err) throw err;
	// results is an array consisting of messages collected during execution
	console.log('results: %j', results);
});
