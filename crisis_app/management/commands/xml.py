import sys

from django.core.management.base import BaseCommand, CommandError
from crisis_app.converters.to_xml import convert

class Command(BaseCommand):
	help = 'generates an xml instance'

	def handle(self, *args, **options):
		s = convert()
		sys.stdout.write(s if sys.stdout.isatty() else s.encode('UTF-8'))



