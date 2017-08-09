#!/bin/bash

npm install -g semver request request-promise

#install workbench and requirements

#git clone https://github.com/Garito/workbench.git
#cd ./workbench ???
#pip install -r requirements.txt
#pip install -r requirements-full.txt
#sudo apt-get install $(sed -rn 's/.*\bdeb:(.+)$/\1/p' requirements.txt requirements-full.txt)

# Do a root crontab with init.sh every

#todo delete if the crontab already exists and create again
echo -e "$(sudo crontab -u root -l)\n*/59 * * * * /opt/MyeReuse.org_Support/resources/init.sh" | sudo crontab -u root -



