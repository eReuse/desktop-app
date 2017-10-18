const generateAndSubmitSnapshot = require('./generateAndSubmitSnapshot')
const page = require('../../resources/.env.json').pages.support
window.$ = window.jQuery = require('jquery')
window._ = require('lodash')

// Executes the workbench
document.getElementById('botoDiag').addEventListener('click', generateAndSubmitSnapshot)
//const $ = window.$
window.$('#main').html(page.html)
/*
if (page.url && IHaveInternet) {
  window.$('#main').html(`<iframe src="${env.pages.support.url}"></iframe>`)
} else {
  window.$('#main').html(page.html)
}*/


// Access to DOM, change or put
let titleHTML = document.title
console.log(titleHTML)
//document.title = titleHTML