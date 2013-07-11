import sys
import os
import datetime,json
from os.path import join
from subprocess import call, Popen, PIPE

from crisis_app import views
from views import makeParent, addChild, makeJSON

from django.test import TestCase

from crisis_app.converters import to_xml
from crisis_app.models import Event, Organization, Person, Embed

XML_FIXTURE_PATH = 'crisis_app/fixtures/xml'
XML = dict((f.split('.')[0], open(join(XML_FIXTURE_PATH, f)).read().strip())
	for f in os.listdir(XML_FIXTURE_PATH))


class ToJsonTestCase(TestCase):

	def test_makeParent_1(self):
		p = makeParent("test","color")
		self.assertEqual(p['id'],"test")
		self.assertEqual(p['data']['$color'],"color")

	def test_makeParent_2(self):
		p = makeParent(1,"color")
		self.assertEqual(p['id'],1)
		self.assertEqual(p['data']['$color'],"color")
		
	def test_makeParent_3(self):
		p = makeParent((1,2),[1,2,3])
		self.assertEqual(p['id'],(1,2))
		self.assertEqual(p['data']['$color'],[1,2,3])		

	def test_addChild_1(self):
		p = makeParent("test","color")
		addChild(p,'child','color',0,[],'desc')
		self.assertEqual(p['children'][0]['id'],'child')
		self.assertEqual(p['children'][0]['data']['$color'],'color')
		self.assertEqual(p['children'][0]['data']['$area'],0)
		self.assertEqual(p['children'][0]['data']['popularity'],0)
		self.assertEqual(p['children'][0]['data']['image'],'None')
		self.assertEqual(p['children'][0]['data']['description'],'desc')

	def test_addChild_2(self):
		p = makeParent("test","color")
		addChild(p,'child','color',0,[],'desc')
		addChild(p,'child','color',0,[1,2,3],'desc')
		self.assertEqual(p['children'][1]['id'],'child')
		self.assertEqual(p['children'][1]['data']['$color'],'color')
		self.assertEqual(p['children'][1]['data']['$area'],0)
		self.assertEqual(p['children'][1]['data']['popularity'],0)
		self.assertEqual(p['children'][1]['data']['image'],'1')
		self.assertEqual(p['children'][1]['data']['description'],'desc')

	def test_makeJSON_1(self):
		j = makeJSON(3)
		p = json.loads(j)
		self.assertEqual(p["id"],"Crisis")
		self.assertEqual(p['children'][0]['id'],"Events")
		self.assertEqual(p['children'][1]['id'],"People")
		self.assertEqual(p['children'][2]['id'],"Organizations")

class ToXmlTestCase(TestCase):

	def test_export(self):
		self.assertEqual(len(Event.objects.all()), 1)
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

