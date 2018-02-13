const generateAndSubmitSnapshot = require('./generateAndSubmitSnapshot')
const page = require('../../resources/.env.json').pages.support
window.$ = window.jQuery = require('jquery')
window._ = require('lodash')

window.$('#main').html(`<iframe id="iframe" src="${page.url}"></iframe>`)

window.$('#iframe').get(0).onload = () => {
  try {
    window.$('#iframe').get(0).contentDocument.head.children[0].text
  } catch(err){
    changeUrl()
  }
}

function changeUrl () {
  window.$('#iframe').hide()
  window.$('#main').html(page.html)
}

// Executes the workbench
document.getElementById('botoDiag').addEventListener('click', generateAndSubmitSnapshot)

// Access to DOM, change or put
//document.title = titleHTML