#!/bin/bash

/opt/MyeReuse.org_Support/resources/after-install/install-workbench.sh
/opt/MyeReuse.org_Support/resources/after-install/add-to-crontab.sh "*/60 8,11,16,17,1 * * 1,3"

#"*/60 8,11,16,17,1 * * 1,3" - At every 60th minute past hour 8, 11, 16, 17, and 1 on Monday and Wednesday