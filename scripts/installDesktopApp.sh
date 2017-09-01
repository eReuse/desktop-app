#!/bin/bash

#Download bash script afterInstall.sh to install Workbench with necessary dependencies and add a cron to autoupdate the app

##
wget -P /tmp https://github.com/eReuse/desktop-app/releases/download/linux-x64-1.0.0/eReuse.org-DesktopApp_1.0.0_x64.deb

wget https://github.com/eReuse/desktop-app/releases/download/linux-x64-1.0.0/eReuse.org-DesktopApp_1.0.0_x64.deb

sudo gdebi -n /tmp/eReuse.org-DesktopApp_1.0.0_x64.deb

/opt/MyeReuse.org_Support/ereuse.org-desktopapp

echo "desktop-all installed successfully"