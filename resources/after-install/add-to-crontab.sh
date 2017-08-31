#!/bin/bash
# Create a root crontab that execute init.sh every 59 minute
time=$1
baseUrl=$2
pathScript="/opt/MyeReuse.org_Support/resources/init.sh"

#Deleting old ereuse crontab
sudo crontab -u root -l | grep -v "eReuse" | sudo  crontab -u root -
#Add new ereuse crontab
echo -e "$(sudo crontab -u root -l)\n$time $pathScript $baseUrl" | sudo crontab -u root -
