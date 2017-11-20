#!/bin/bash
# You need to run this file with sudo or root user
# Fix if dpkg was interrupted
sudo dpkg --configure -a
# Remove desktop-app and dependencies
apt-get remove ereuse.org-desktopapp -y
apt-get autoremove -y

# Uninstall Node 7.10
n-uninstall -y

# Remove app folder
rm -r /opt/MyeReuse.org_Support
rm -r /tmp/*