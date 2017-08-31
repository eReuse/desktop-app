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

    * Take a Snapshot (Workbench) and sent to DeviceHub

    * Visit www.eReuse.org


## Installation

If you're used to use git clone,
this method is for you.

#### Quickstart:

1. `git clone https://github.com/eReuse/desktop-app.git`
2. `cd desktop-app`
3. `npm install`
4. Configure `env-sample.json` and rename it to `env.json`


+ Clone all the files of github repository in a desktop-app folder,
  within that folder run afterInstall.sh for install a

        > $ git clone https://github.com/eReuse/desktop-app.git

        > $ cd desktop-app

        > $ sudo ./afterInstall.sh

* To install the dependencies and devDependencies

        > $ npm install

* For run the app

        > $ npm start

* To build and generate executables (deb) for x64 and ia32

        > $ npm run dist

    - Only Linux x64 arch

            > $ npm run linux64

    - Only Linux ia32 arch

            > $ npm run linux32