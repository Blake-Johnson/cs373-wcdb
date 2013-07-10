import sys
from subprocess import call

from django.core.management.base import BaseCommand, CommandError
from crisis_app.converters.to_xml import convert

class Command(BaseCommand):
    help = 'generates an xml instance'

    def handle(self, *args, **options):
		call('''
			xmllint --noout --schema crisis_app/static/WorldCrises.xsd.xml -
		'''.strip().split())
