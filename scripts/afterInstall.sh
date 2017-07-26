#!/bin/bash

# instalar require script.js amb npm
# curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

npm install -g semver request request-promise

# Do a root crontab with init.sh every

#todo check if the crontab already exists
echo -e "$(sudo crontab -u root -l)\n*/59 * * * * /opt/MyeReuse.org_Support/resources/init.sh" | sudo crontab -u root -



