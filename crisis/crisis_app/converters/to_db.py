from xml.etree.ElementTree import fromstring
from datetime import datetime

from django.utils.timezone import now

from crisis_app import models


def kind(el, parent):
	if 'citation' in parent.tag.lower() or 'external' in parent.tag.lower():
		return 'CIT'
	if 'imag' in parent.tag.lower() or 'img' in parent.tag.lower():
		return 'IMG'
	u = el.get('href') or el.get('embed')
	d = {'youtube': 'YTB', 'vimeo': 'VMO', 'maps.google': 'GMP',
			'bing.com/map': 'BMP', 'mapq': 'MPQ', 'mapquest': 'MPQ', 'twitter':
			'TWT', 'facebook': 'FBK', 'plus.google': 'GPL'}
	for k, v in d.items():
		if k in u:
			return v
	if 'video' in parent.tag.lower():
		return 'VEX'
	if 'map' in parent.tag.lower():
		return 'MEX'
	if 'feed' in parent.tag.lower():
		return 'FEX'
	raise Exception('couldnt figure out link type')


def _process_link_set(self, el):
	for child in el:
		if child.get('href'):
			url, desc = child.get('href'), child.text
		else:
			url, desc = child.get('embed'), child.get('text')
		self.embeds.append(models.Embed(kind=kind(child, el), url=url,
			desc=desc))


def _process_relation(self, el):
	self.relations[el.tag] = [child.get('ID') for child in el]


class ModelToXmlConversion(object):
	@property
	def ModelClass(self): return getattr(models, self.__class__.__name__)

	def __init__(self, root):
		self.root = root
		self.model = self.ModelClass()
		self.model.xml_id = root.get('ID')[4:]
		self.model.name = root.get('Name')
		self.model.date_time = now()
		self.embeds = []
		self.relations = {}
		self._add_children_to_model(root)

	def _add_children_to_model(self, el):
		for e in el:
			method = '_process_' + e.tag.lower()
			if hasattr(self, method):
				getattr(self, method)(e)

	def _process_kind(self, el):
		self.model.kind = el.text

	def _process_date(self, el):
		orig = self.model.date_time
		d = datetime.strptime(el.text, '%Y-%m-%d')
		self.model.date_time = datetime(year=d.year, month=d.month, day=d.day,
				hour=orig.hour, minute=orig.minute, tzinfo=orig.tzinfo)

	def _process_time(self, el):
		orig = self.model.date_time
		d = datetime.strptime(el.text, '%H:%M:%S')
		self.model.date_time = datetime(year=orig.year, month=orig.month,
				day=orig.day, hour=d.hour, minute=d.minute, tzinfo=orig.tzinfo)

	def _process_history(self, el):
		self.model.history = ', '.join(e.text for e in el)

	def _process_location(self, el):
		self.model.location = el.text

	def _process_locations(self, el):
		self.model.location = ', '.join(e.text for e in el)

	def _process_humanimpact(self, el):
		self.model.human_impact = '\n'.join(e.text for e in el)

	def _process_economicimpact(self, el):
		self.model.economic_impact = '\n'.join(e.text for e in el)

	def _process_resourcesneeded(self, el):
		self.model.resources_needed = '\n'.join(e.text for e in el)

	def _process_waystohelp(self, el):
		self.model.ways_to_help = '\n'.join(e.text for e in el)

	def _process_contactinfo(self, el):
		self.model.contact_info = '\n'.join(e.text for e in el)

	def _process_common(self, el):
		self._add_children_to_model(el)

	_process_citations = _process_link_set
	_process_externallinks = _process_link_set
	_process_images = _process_link_set
	_process_videos = _process_link_set
	_process_maps = _process_link_set
	_process_feeds = _process_link_set

	_process_crises = _process_relation
	_process_people = _process_relation
	_process_organizations = _process_relation


class Event(ModelToXmlConversion): pass
class Person(ModelToXmlConversion): pass
class Organization(ModelToXmlConversion): pass


mapping = {'Crisis': Event, 'Person': Person, 'Organization': Organization}
tag_mapping = {
	'Crises': models.Event,
	'People': models.Person,
	'Organizations': models.Organization,
}

rel_mapping = {
	'Crises': 'event',
	'People': 'person',
	'Organizations': 'organization',
}


def convert(xml):
	xml = xml.read() if hasattr(xml, 'read') else xml
	conversions = [mapping[el.tag](el) for el in fromstring(xml)]

	# save all of the models
	[c.model.save() for c in conversions]

	# save all of the embeds
	[e.save() for c in conversions for e in c.embeds]

	# link all of the embeds to their corresponding model
	[c.model.embed_set.add(*c.embeds) for c in conversions]

	# set up all of the many-to-many relationships
	for c in conversions:
		for rel_tag, ids in c.relations.items():
			items = tag_mapping[rel_tag]
			for i in ids:
				item = items.objects.filter(xml_id=i[4:])[0]
				if not item:
					raise Exception('couldnt find model w/ corresponding id')
				if hasattr(c.model, rel_mapping[rel_tag]):
					getattr(c.model, rel_mapping[rel_tag]).add(item)
				elif hasattr(c.model, rel_mapping[rel_tag] + '_set'):
					getattr(c.model, rel_mapping[rel_tag] + '_set').add(item)
				else:
					raise Exception('model doesnt have relation set')


	return conversions


