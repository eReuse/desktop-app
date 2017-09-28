#!/bin/bash

#Download bash script afterInstall.sh to install Workbench with necessary dependencies and add a cron to autoupdate the app
#todo usage if argv < 2 no ver or arch
ver=$1
arch=$2
##
wget -P /tmp https://github.com/eReuse/desktop-app/releases/download/linux-$ver/eReuse.org-DesktopApp_$ver'_'$arch.deb

#wget https://github.com/eReuse/desktop-app/releases/download/linux-ia32-0.1.0/eReuse.org-DesktopApp_0.1.0_ia32.deb

sudo gdebi --n /tmp/eReuse.org-DesktopApp_$ver'_'$arch.deb

/opt/MyeReuse.org_Support/ereuse.org-desktopapp

echo "desktop-all installed successfully"