#!/bin/bash

#sleep 10

#instalar require script.js amb npm

npm install -g semver
npm install -g request
npm install -g request-promise

#executa el script que arrenca el autoupdater amb cron

crontab 1 * * * * root /opt/MyeReuse.org_Support/resources/init.sh




