import sys

from django.test import TestCase
from crisis_app.converters import to_xml
from crisis_app.models import Event, Organization, Person, Embed


class ToXmlTestCase(TestCase):

	def test_export(self):
		self.assertGreater(len(Event.objects.all()), 0)

