#!/bin/bash
# You need to run this file with sudo or root user
#delete n folder

curl -L https://git.io/n-install | N_PREFIX=/opt/MyeReuse.org_Support/n bash -s -- -y 7.10.1
source ~/.bashrc #Refresh env

# put N_PREFIX in first on PATH (bashrc)
export PATH="/opt/MyeReuse.org_Support/n/bin:$PATH"

# Local folder
mkdir -pm 777 /opt/MyeReuse.org_Support/eReuse.org-Workbench
cd /opt/MyeReuse.org_Support/

# node will install in /opt/MyeReuse.org_Support/node_modules
npm install semver request request-promise promise node-linux lodash

cd /opt/MyeReuse.org_Support/eReuse.org-Workbench

pip install setuptools enum34 python-dateutil pySMART pyudev tqdm requests lxml gnupg celery redis  # Workbench dependencies

# Clone workbench files
git clone https://github.com/Garito/workbench.git
#cd workbench
#./script/erwb-devel

node /opt/MyeReuse.org_Support/resources/init.node.js

# Enable execute service every start
systemctl enable ereusedesktopapp.service
