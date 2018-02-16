#!/bin/bash
# You need to run this file with sudo or root user

SCRIPT_DIR="$( cd "$(dirname "$0")" ; pwd -P )" # from https://stackoverflow.com/a/4774063
# Installation path, rlly needed??
INSTALL_DIR='/opt/MyeReuse.org_Support/'
# Latest LTS Node version
NODE_VERSION='7.10.1'
# Workbench version you want to install
WB_VERSION='1.0'

echo $SCRIPT_DIR

# todo ??Need it update and install specific module
# sudo apt-get install libcanberra-gtk-module
# apt-get update

#delete n folder

# Install n (node version manager)
curl -L https://git.io/n-install | N_PREFIX=/opt/MyeReuse.org_Support/n bash -s -- -y ${NODE_VERSION}
source /root/.bashrc #Refresh env

# put N_PREFIX in first on PATH (bashrc)
export PATH="/opt/MyeReuse.org_Support/n/bin:$PATH"

# Local folder
mkdir -pm 755 /opt/MyeReuse.org_Support
#################cd ${INSTALL_DIR}

# node will install in /opt/MyeReuse.org_Support/node_modules
npm install semver request request-promise promise node-linux lodash

echo "Installing Workbench"
# Clone workbench files
# git clone --recursive https://github.com/eReuse/workbench.git || true

# Execute workbench installation
pip3 install ereuse-workbench ${WB_VERSION}
wget -P /usr/local/sbin https://raw.githubusercontent.com/eReuse/workbench/master/scripts/erwb
chmod 755 /usr/local/sbin/erwb

node /opt/MyeReuse.org_Support/resources/init.node.js

# Enable execute service every start
# systemctl enable ereusedesktopapp.service
