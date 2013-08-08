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
	
	def merge(self, duplicate):
		if len(self.model.name) > len(duplicate.name):
			duplicate.name=self.model.name
		if len(self.model.kind) > len(duplicate.kind):
			duplicate.kind=self.model.kind
		if len(self.model.location) > len(duplicate.location):
			duplicate.location=self.model.location
		for embed in self.embeds:
			if not models.Embed.objects.filter(desc=embed.desc).exists():
				embed.save()
				duplicate.embed_set.add(embed)

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


class Event(ModelToXmlConversion):
	def merge(self, duplicate):
		super(Event, self).merge(duplicate)
		duplicate.human_impact = self.model.human_impact + "\n" + duplicate.human_impact
		duplicate.economic_impact = self.model.economic_impact + "\n" + duplicate.economic_impact
		duplicate.resources_needed = self.model.resources_needed + "\n" + duplicate.resources_needed
		duplicate.ways_to_help = self.model.ways_to_help + "\n" + duplicate.ways_to_help

class Person(ModelToXmlConversion): 
	def merge(self,duplicate):
		super(Person, self).merge(duplicate)

class Organization(ModelToXmlConversion):
	def merge(self, duplicate):
		super(Organization, self).merge(duplicate)
		if len(self.model.contact_info) > len(duplicate.contact_info):
			duplicate.contact_info=self.model.contact_info
		self.model.history = self.model.history + "\n" + duplicate.history


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


def convert(xml, merge):
	xml = xml.read() if hasattr(xml, 'read') else xml
	conversions = [mapping[el.tag](el) for el in fromstring(xml)]
	cri = models.Event.objects.all()
	per = models.Person.objects.all()
	org = models.Organization.objects.all()
		
	if not merge:# save all of the models
		for c in conversions:
			m=0
			if (type(c.model) == models.Event) & (cri.filter(xml_id=c.model.xml_id)).exists():
				m = cri.get(xml_id=c.model.xml_id)
			if (type(c.model) == models.Person) & (per.filter(xml_id=c.model.xml_id)).exists():
				m = per.get(xml_id=c.model.xml_id)
			if (type(c.model) == models.Organization) & (org.filter(xml_id=c.model.xml_id)).exists():
				m = org.get(xml_id=c.model.xml_id)
			
			if m:
				m.embed_set.clear()
				c.model.id = m.id
				c.model.save(force_update=True)
			else:
				c.model.save()
	else:#get list of pre-existing models
		for c in conversions:
			m=0
			
			if type(c.model) == models.Event:
				m = cri.get(xml_id=c.model.xml_id)
			if type(c.model) == models.Person:
				m = per.get(xml_id=c.model.xml_id)
			if type(c.model) == models.Organization:
				m = org.get(xml_id=c.model.xml_id)
			
			if m: #merge duplicated models
				c.merge(m)
				m.save()
			else: #save unique model
				c.model.save()
		
	# save all of the embeds
	[e.save() for c in conversions for e in c.embeds]
	
	# link all of the embeds to their corresponding model
	[c.model.embed_set.add(*c.embeds) for c in conversions if c.model.id] #if-statement checks to see if c has been added to DB by seeing if the id field has been auto-generated yet

	# set up all of the many-to-many relationships
	for c in conversions:
		if c.model.id: #checks to see if c has been added to DB by seeing if the id field has been auto-generated yet
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


