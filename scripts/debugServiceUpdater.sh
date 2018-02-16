#!/bin/bash

  service ereusedesktopapp status
  printf "-----------/n"
  cat /etc/systemd/system/ereusedesktopapp.service
  printf "-----------/n"

  # change apt-cache to dpkg-query to take version
  dpkg-query -W -f='${Version}\n' ereuse.org-desktopapp
  dpkg-query --show --show-format='${Version}\n' ereuse.org-desktopapp

  printf "-----------/n"
  #journalctl -u ereusedesktopapp
