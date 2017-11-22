#!/bin/bash

  service ereusedesktopapp status
  printf "-----------/n"
  cat /etc/systemd/system/ereusedesktopapp.service
  printf "-----------/n"
  apt-cache policy ereuse.org-desktopapp
  printf "-----------/n"
 #journalctl -u ereusedesktopapp