#!/usr/bin/env bash

npm install -g semver request request-promise

# Local folder
sudo mkdir /opt/eReuse.org-Workbench

sudo chmod o+rwx /opt/eReuse.org-Workbench

cd /opt/eReuse.org-Workbench

# Install requirements and workbench
# Install virtual environment so we don't touch other pythons' packages
sudo pip install virtualenv
virtualenv virtualenv  # Create virtualenv configuration in actual dir
source virtualenv/bin/activate  # Activate virtualenv

pip install setuptools enum34 python-dateutil pySMART pyudev tqdm requests lxml gnupg  # This is installed in virtualenv

###
git clone https://github.com/Garito/workbench.git
cd workbench
pip install -e .
sudo ./scripts/erwb
#sudo python /home/nadeu/Documents/eReuse/provaWb/workbench/scripts/erwb

#source deactivate
