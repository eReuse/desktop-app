#!/usr/bin/env bash

#Installation npm & node

sudo apt-get install npm
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Electron

sudo npm install -g electron

#Get desktop-app files

git clone https://github.com/eReuse/desktop-app.git

cd desktop-app

sudo ./afterInstall.sh
