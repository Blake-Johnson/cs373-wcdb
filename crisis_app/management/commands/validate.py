import sys, os

from django.core.management.base import BaseCommand, CommandError

from minixsv.pyxsval import parseAndValidateXmlInputString

XSD = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
	'../../static/WorldCrises.xsd.xml')).read()

class Command(BaseCommand):
	help = 'validates xml input'

	def handle(self, *args, **options):
		parseAndValidateXmlInputString(
			inputText=sys.stdin.read(), xsdText=XSD)
