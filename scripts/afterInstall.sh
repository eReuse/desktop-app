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
pip install git+https://github.com/eReuse/workbench.git
#pip install git+https://github.com/Garito/workbench.git

# Create a root crontab that execute init.sh every 59 minute

if [! crontab -l | grep -q '/opt/MyeReuse.org_Support/resources/init.sh']; then
    echo -e "$(sudo crontab -u root -l)\n*/59 * * * * /opt/MyeReuse.org_Support/resources/init.sh" | sudo crontab -u root -
fi


