import sys
import os
import datetime, json
from os.path import join
from subprocess import call, Popen, PIPE

from crisis_app import views
from views import make_parent, add_child, make_json

from django.test import TestCase
from django.core import management
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from crisis_app.converters import to_xml, to_db
from crisis_app.models import Event, Organization, Person, Embed

XML_FIXTURE_PATH = 'crisis_app/fixtures/xml'
XML = dict((f.split('.')[0], open(join(XML_FIXTURE_PATH, f)).read().strip())
	for f in os.listdir(XML_FIXTURE_PATH))

class UsefulTestCase(TestCase):

	def _clear_db(self):
		management.call_command('flush', load_initial_data=False,
				interactive=False)

	def _reset_db(self):
		management.call_command('flush', interactive=False)


class ToJsonTestCase(TestCase):

	def test_make_parent_1(self):
		p = make_parent("test", "color")
		self.assertEqual(p['id'], "test")
		self.assertEqual(p['data']['$color'], "color")

	def test_make_parent_2(self):
		p = make_parent(1, "color")
		self.assertEqual(p['id'], 1)
		self.assertEqual(p['data']['$color'], "color")
		
	def test_make_parent_3(self):
		p = make_parent((1, 2), [1, 2, 3])
		self.assertEqual(p['id'], (1, 2))
		self.assertEqual(p['data']['$color'], [1, 2, 3])		

	def test_add_child_1(self):
		p = make_parent("test", "color")
		add_child(p, 'child', 'color', 0, [], 'desc')
		self.assertEqual(p['children'][0]['id'], 'child')
		self.assertEqual(p['children'][0]['data']['$color'], 'color')
		self.assertEqual(p['children'][0]['data']['$area'], 0)
		self.assertEqual(p['children'][0]['data']['popularity'], 0)
		self.assertEqual(p['children'][0]['data']['image'], 'None')
		self.assertEqual(p['children'][0]['data']['description'], 'desc')

	def test_add_child_2(self):
		p = make_parent("test", "color")
		add_child(p, 'child', 'color', 0, [], 'desc')
		add_child(p, 'child', 'color', 0, [1, 2, 3], 'desc')
		self.assertEqual(p['children'][1]['id'], 'child')
		self.assertEqual(p['children'][1]['data']['$color'], 'color')
		self.assertEqual(p['children'][1]['data']['$area'], 0)
		self.assertEqual(p['children'][1]['data']['popularity'], 0)
		self.assertEqual(p['children'][1]['data']['image'], '1')
		self.assertEqual(p['children'][1]['data']['description'], 'desc')

	def test_make_json_1(self):
		j = make_json(3)
		p = json.loads(j)
		self.assertEqual(p["id"], "Crisis")
		self.assertEqual(p['children'][0]['id'], "Events")
		self.assertEqual(p['children'][1]['id'], "People")
		self.assertEqual(p['children'][2]['id'], "Organizations")

class ToXmlTestCase(TestCase):
	fixtures = ['test_data.json']

	def test_export(self):
		# just a sanity check to make sure we're working w/ the correct data
		self.assertEqual(len(Event.objects.all()), 1)

		# the real test
		self.assertEqual(to_xml.convert().strip(), XML['initial_data'])

	def test_export_validation(self):
		xml = Popen('./manage.py xml'.split(), stdout=PIPE)
		devnull = open(os.devnull, 'w')
		self.assertEqual(call('./manage.py validate'.split(),
			stdin=xml.stdout, stdout=devnull, stderr=devnull), 0)
		try:
   			devnull.close()
		except:
		   pass
		xml.kill()

class ToDbTestCase(UsefulTestCase):

	def test_import(self):
		self._clear_db()
		self.assertEqual(len(Event.objects.all()), 0)
		to_db.convert(XML['initial_data'])
		events = Event.objects.all()
		people = Person.objects.all()
		orgs = Organization.objects.all()

		self.assertEqual(len(events), 1)
		self.assertEqual(len(events[0].organization_set.all()), 1)
		self.assertEqual(len(events[0].person_set.all()), 1)
		self.assertEqual(len(events[0].embed_set.all()), 8)

		self.assertEqual(len(people), 1)
		self.assertEqual(len(people[0].event.all()), 1)
		self.assertEqual(len(people[0].organization_set.all()), 1)
		self.assertEqual(len(people[0].embed_set.all()), 10)

		self.assertEqual(len(orgs), 1)
		self.assertEqual(len(orgs[0].event.all()), 1)
		self.assertEqual(len(orgs[0].person.all()), 1)
		self.assertEqual(len(orgs[0].embed_set.all()), 10)

		self._reset_db()

class ImportExportTest(UsefulTestCase):
	PWD = '123'

	def setUp(self):
		self._clear_db()
		self.xml = open(join(XML_FIXTURE_PATH, 'initial_data.xml'))
		self.user = User.objects.create_user('admin', 'dont@talk.to.me',
				self.PWD)

	def tearDown(self):
		self.client.logout()
		self.user.delete()
		self.xml.close()
		self._reset_db()

	def test_xml_redirect_to_login(self):
		response = self.client.get('/upload_xml')
		self.assertEqual(response.status_code, 302)

	def test_xml_submission(self):
		self.client.login(username=self.user.username, password=self.PWD)
		response = self.client.get('/upload_xml')
		self.assertEqual(response.status_code, 200)

		response = self.client.post('/upload_xml', {
			'xml': self.xml,
			'Submit': 'Submit'
		})
		self.assertEqual(response.status_code, 302)
		self.assertEqual(response['location'], 'http://testserver/xml')

		response = self.client.get('/xml')
		try:
			self.assertEqual(response.content.strip(),
				XML['initial_data'].strip())
		except AssertionError as e:
			# write the wrong file out to disk for inspection from the cmd line
			open('invalid_response.xml', 'w').write(response.content)
			raise e
