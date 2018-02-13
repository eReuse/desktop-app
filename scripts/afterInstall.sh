#!/bin/bash
# You need to run this file with sudo or root user

SCRIPT_DIR="$( cd "$(dirname "$0")" ; pwd -P )" # from https://stackoverflow.com/a/4774063
# Installation path
INSTALL_DIR='/opt/MyeReuse.org_Support/'
# Latest LTS Node version
NODE_VERSION='7.10.1'

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
cd ${INSTALL_DIR}

# node will install in /opt/MyeReuse.org_Support/node_modules
npm install semver request request-promise promise node-linux lodash

# cd ${INSTALL_DIR}/eReuse.org-Workbench
# pip install setuptools enum34 python-dateutil pySMART pyudev tqdm requests lxml gnupg celery redis  # Workbench dependencies

echo "Installing Workbench"
# Clone workbench files
git clone --recursive https://github.com/eReuse/workbench.git || true
# Execute workbench installation
cd workbench
chmod 755 scripts/install.sh
./script/install.sh ${INSTALL_DIR}/workbnech

node /opt/MyeReuse.org_Support/resources/init.node.js

# Enable execute service every start
# systemctl enable ereusedesktopapp.service
