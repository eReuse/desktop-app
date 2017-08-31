#!/usr/bin/env bash

npm install -g semver request request-promise

# Local folder
sudo mkdir -pm 777 /opt/MyeReuse.org_Support/eReuse.org-Workbench
cd /opt/MyeReuse.org_Support/eReuse.org-Workbench

pip install setuptools enum34 python-dateutil pySMART pyudev tqdm requests lxml gnupg  # Workbench dependencies

###
git clone https://github.com/Garito/workbench.git
cd workbench
sudo ./scripts/erwb-devel
#pip install -e .
#sudo ./scripts/erwb
