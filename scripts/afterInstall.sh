#!/bin/bash

#sleep 10

# instalar require script.js amb npm
# curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
# sudo apt-get install -y nodejs
# sudo apt-get install -y npm

npm install -g semver request request-promise
#npm install -g request
#npm install -g request-promise

# executa el script que arrenca el autoupdater amb cron

echo -e "$(sudo crontab -u root -l)\n1 * * * * /opt/MyeReuse.org_Support/resources/init.sh" | sudo crontab -u root -



