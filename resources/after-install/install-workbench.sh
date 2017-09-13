#!/bin/bash

# You need to run this file with sudo

npm install -g semver request request-promise promise

# Local folder
mkdir -pm 777 /opt/MyeReuse.org_Support/eReuse.org-Workbench
cd /opt/MyeReuse.org_Support/eReuse.org-Workbench

pip install setuptools enum34 python-dateutil pySMART pyudev tqdm requests lxml gnupg celery redis  # Workbench dependencies

# Clone workbench files
git clone https://github.com/Garito/workbench.git
#cd workbench
#sudo ./scripts/erwb-devel
