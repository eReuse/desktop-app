// const generateAndSubmitSnapshot = require('./generateAndSubmitSnapshot')
const page = require('../../resources/.env.json').pages.support
window.$ = window.jQuery = require('jquery')
window._ = require('lodash')

window.$('#main').html(`<iframe id="iframe" src="${page.url}"></iframe>`)

window.$('#iframe').get(0).onload = () => {
  try {
    window.$('#iframe').get(0).contentDocument.head.children[0].text
    console.log('loaded')
  } catch(err){
    changeUrl()
    console.log('no')
  }
}

function changeUrl () {
  window.$('#iframe').hide()
  window.$('#main').html(page.html)
}

// Executes the workbench
// document.getElementById('botoDiag').addEventListener('click', generateAndSubmitSnapshot)
/* Button Diag Code <br>
  <div class="text-center">
    <button id='botoDiag' class="btn btn-primary btn-lg">Diagnostic</button>
  </div> */

// Access to DOM, change or put
//document.title = titleHTML