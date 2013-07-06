import sys
import os

# jank jank jank jank jank
if 'DJANGO_SETTINGS_MODULE' not in os.environ:
	os.environ['DJANGO_SETTINGS_MODULE'] = 'crisis.crisis.settings'
try:
	from crisis_app import models
except ImportError:
	sys.path.append('crisis')
	from crisis_app import models

import to_xml
import to_db


