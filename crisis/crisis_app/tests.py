import sys
import os
from os.path import join

from django.test import TestCase
from crisis_app.converters import to_xml
from crisis_app.models import Event, Organization, Person, Embed

XML_FIXTURE_PATH = 'crisis_app/fixtures/xml'
XML = dict((f.split('.')[0], open(join(XML_FIXTURE_PATH, f)).read().strip())
	for f in os.listdir(XML_FIXTURE_PATH))


class ToXmlTestCase(TestCase):

	def test_export(self):
		self.assertEqual(len(Event.objects.all()), 1)
		self.assertEqual(to_xml.convert().strip(), XML['initial_data'])

