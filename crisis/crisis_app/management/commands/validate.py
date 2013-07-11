import sys
from subprocess import check_call

from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
	help = 'validates xml input'

	def handle(self, *args, **options):
		check_call('''
			xmllint --noout --schema crisis_app/static/WorldCrises.xsd.xml -
		'''.strip().split())
