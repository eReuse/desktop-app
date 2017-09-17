const Service = require('node-linux').Service

// Create a new service object
/**
 * "wait": seconds to wait before attempting a restart
 * "grow": number between 0-1 representing the percentage growth rate for the wait interval
 * @type {daemon}
 */
let svc = new Service({
  name: 'updaterereuse',
  description: 'Background Node.js script to autoupdate DesktopApp.',
  script: '/opt/MyeReuse.org_Support/resources/script-updater-background.js',
  wait: 600,
  grow: 1,
})

svc.install()

// Listen for the "alreadyinstalled" event, which indicates the
// process is available as a service.
svc.on('alreadyinstalled', function () {
  console.log('service is already installed')
  // Uninstall the service.
  svc.uninstall()
})

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.')
  console.log('The service exists: ',svc.exists())
  svc.install()
})

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start()
  console.log('Service is installed.')
  console.log('The service exists: ', svc.exists())
})
