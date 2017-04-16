'use strict';
/* proces on background where we can execute python scripts */

const { remote } = require('electron');
const PythonShell = require('python-shell');

PythonShell.run('my_script.py', function (err) {
  if (err) {
    throw err;
  }
  console.log('finished');
});
