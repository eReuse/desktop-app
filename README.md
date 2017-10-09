# eReuse.org Desktop-App

The eReuse.org Desktop-App is an electron app supporting help-desk incidents ocurred on desktops and laptops.


## Features


+ Technologies:

        Electron
        Node JS
        Bash

+ Environment:

        NPM
        Node.js

-----------------------------------------------------

    * Debian packages (deb) [for now]

    * Take a Snapshot (Workbench) and send to DeviceHub

    * Visit www.eReuse.org

    * AutoUpdate using systemd and Node.js script


## Installation

If you're used to use git clone,
this method is for you.

#### Quickstart:

1. `git clone https://github.com/eReuse/desktop-app.git`
2. `cd desktop-app`
3. `npm install`
4. Open and configure `env-sample.json` like the example and rename it to `env.json`:

```json
{
 "account": "value",
 "password": "12345"
}
```


+ Clone all the files of github repository in a desktop-app folder,
  within that folder run afterInstall.sh for install a

        > $ git clone https://github.com/eReuse/desktop-app.git

        > $ cd desktop-app

        > $ sudo ./scripts/afterInstall.sh

* To install the dependencies and devDependencies

        > $ npm install

* For run the app

        > $ npm start

* To build and generate executables (deb) for x64 and x32

        > $ npm run dist

    - Only Linux x64 arch

            > $ npm run dist64

    - Only Linux x32 arch

            > $ npm run dist32

###