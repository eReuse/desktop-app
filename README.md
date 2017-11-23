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

## Development

### Installation

Before to install destktop-app, we need to install some dependencies.

#### Dependencies

    * Node js 7.10.1 or higher
    * NPM 4.2.0 or higher
    * Electron 1.6.2

#### Quickstart:

1. `git clone https://github.com/eReuse/desktop-app.git`
2. `cd desktop-app`
3. `npm install`
4. `sudo ./scripts/afterInstall.sh`

#### Step by step:

+ Clone all the files of github repository in a desktop-app folder, then
  within that folder run afterInstall.sh.

        > $ git clone https://github.com/eReuse/desktop-app.git

        > $ cd desktop-app

        > $ sudo ./scripts/afterInstall.sh

* To install npm dependencies and devDependencies.

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