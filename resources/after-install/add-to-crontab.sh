#!/bin/bash
# You need to run this file with sudo
# Create a root crontab that execute init.sh every 59 minute
time=$1
baseUrl=$2
pathScript="/opt/MyeReuse.org_Support/resources/init.sh"

#Deleting old ereuse crontab
crontab -u root -l | grep -v "eReuse" | crontab -u root -
#Add new ereuse crontab
echo -e "$(crontab -u root -l)\n$time $pathScript $baseUrl" | crontab -u root -
