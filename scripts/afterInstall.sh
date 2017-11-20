#!/bin/bash
# You need to run this file with sudo or root user

# todo ??Need it update
apt-get update

#delete n folder
curl -L https://git.io/n-install | N_PREFIX=/opt/MyeReuse.org_Support/n bash -s -- -y 7.10.1
source root/.bashrc #Refresh env

# put N_PREFIX in first on PATH (bashrc)
export PATH="/opt/MyeReuse.org_Support/n/bin:$PATH"

# Local folder
mkdir -pm 777 /opt/MyeReuse.org_Support/eReuse.org-Workbench
cd /opt/MyeReuse.org_Support/

# node will install in /opt/MyeReuse.org_Support/node_modules
npm install semver request request-promise promise node-linux lodash

cd /opt/MyeReuse.org_Support/eReuse.org-Workbench

pip install setuptools enum34 python-dateutil pySMART pyudev tqdm requests lxml gnupg celery redis  # Workbench dependencies
echo "Installing Workbench"
# Clone workbench files
git clone https://github.com/Garito/workbench.git || true
cd workbench
git pull
pip install -e .
#./script/erwb-devel

node /opt/MyeReuse.org_Support/resources/init.node.js

# Enable execute service every start
# systemctl enable ereusedesktopapp.service
