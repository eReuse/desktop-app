#!/bin/bash

npm install -g semver request request-promise

# Local folder
mkdir /opt/eReuse.org-Workbench

cd /opt/eReuse.org-Workbench

#install requirements and workbench
# Install virtual environment so we don't touch other pythons' packages
pip install virutalenv
virtualenv virtualenv  # Create virtualenv configuration in actual dir
source virtualenv/bin/activate  # Activate virtualenv

pip install setuptools enum34 python-dateutil pySMART pyudev tqdm requests lxml gnupg  # This is installed in virtualenv
pip install git+https://github.com/eReuse/workbench.git

# Do a root crontab with init.sh every

#todo delete if the crontab already exists and create again
if [! crontab -l | grep -q '/opt/MyeReuse.org_Support/resources/init.sh']; then
    echo -e "$(sudo crontab -u root -l)\n*/59 * * * * /opt/MyeReuse.org_Support/resources/init.sh" | sudo crontab -u root -
fi


