#!/bin/bash
# You need to run this file with sudo or root user

apt remove ereuse.org-desktopapp -y

# Remove desktopapp dependecies
apt autoremove -y

n-uninstall -y

rm -r /opt/MyeReuse.org_Support