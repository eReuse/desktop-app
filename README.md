# eReuse.org Desktop-App

The eReuse.org Desktop-App is an electron app to support and report incidents in recycle pc's, and show relevant information about the social contribution with usage of the computer.

## Features



## Installation

First create a new folder, then download and put all files of github repository in the folder, finally within that folder run on terminal:

* To install the dependencies and devDependencies:

    > $ npm install

* For run the app:

    > $ npm start

* To build and generate executables (AppImage) for x64 and ia32:

    > $ npm run dist

    - Only Linux x64 arch:

        > $ npm run dist64

    - Only Linux ia32 arch:

        > $ npm run dist32

* To build and publish a new release for x64 or ia32, execute respecticly:

    > $npm run release64 -- -- --transport-token<Your Github API Token>

    > $npm run release32 -- -- --transport-token<Your Github API Token>
