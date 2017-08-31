#!/usr/bin/env bash
# Create a root crontab that execute init.sh every 59 minute
time=$1
baseUrl=$2

if [! crontab -l | grep -q '/opt/MyeReuse.org_Support/resources/init.sh']; then
    echo -e "$(sudo crontab -u root -l)\n$time /opt/MyeReuse.org_Support/resources/init.sh $baseUrl" | sudo crontab -u root -
fi
