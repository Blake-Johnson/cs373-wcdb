import sys

from django.core.management.base import BaseCommand, CommandError

from crisis_app.converters.prune_xml import prune

class Command(BaseCommand):
	help = 'filter out everything but our data from xml'

	def handle(self, *args, **options):
		s = prune(sys.stdin.read())
		sys.stdout.write(s if sys.stdout.isatty() else s.encode('UTF-8'))

