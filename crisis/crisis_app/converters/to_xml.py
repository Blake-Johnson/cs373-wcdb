import sys
import os
from xml.etree.ElementTree import ElementTree, Element, tostring, fromstring
from StringIO import StringIO
from xml.dom import minidom
from collections import OrderedDict

from crisis_app import models

def s(text):
	# return text.encode('UTF-8') if hasattr(text, 'encode') else str(text)
	return str(text)

def e(tag, text=None, attr={}):
	e = Element(tag=tag)
	if text != None:
		try:
			e.text = s(text)
		except Exception, e:
			import pdb; pdb.set_trace()
			raise e
	[e.set(k, s(v)) for k, v in attr.items()]
	return e


def id_prefixed(tag, i):
	return tag[:3].upper() + '_' + i


class XmlToModelConversion(object):
	@property
	def tag(self): return self.__class__.__name__

	def _add_field_as_nested_tag(self, model, el, tag, field, anchor=False):
		el.append(e(tag=tag))
		if anchor:
			a = fromstring(getattr(model, field))
			list(el)[-1].append(e(tag='li', text=a.text,
				attr={'href': a.get('href')}))
		else:
			list(el)[-1].append(e(tag='li', text=getattr(model, field)))

	def _add_embed_list(self, models, el, tag, attr='href'):
		list_el = e(tag)
		el.append(list_el)
		for i, m in enumerate(models):
			if attr == 'href':
				list_el.append(e('li', text=m.desc, attr={attr: m.url}))
			else:
				list_el.append(e('li', attr={attr: m.url, 'text': m.desc}))

	def _add_relationships(self, model, el, plural_tag, singluar_tag, attr):
		plural_el = Element(plural_tag)
		for other in getattr(model, attr).all():
			plural_el.append(e(tag=singluar_tag,
				attr={'ID': id_prefixed(singluar_tag, other.xml_id)}))
		el.append(plural_el)

	def _add_model_data_to_el(self, model, el):
		el.set('ID', id_prefixed(self.tag, model.xml_id))
		el.set('Name', model.name)
		self._add_common_fields(model, el)

	def _add_common_fields(self, model, el):
		citations = model.embed_set.filter(kind='CIT')
		el.append(e('Common'))
		el = list(el)[-1]
		self._add_embed_list(citations[0:1], el, 'Citations')
		self._add_embed_list(citations[1:], el, 'ExternalLinks')
		self._add_embed_list(model.embed_set.filter(kind='IMG'), el, 'Images',
			attr='embed')
		self._add_embed_list(model.embed_set.filter(
			kind__in=('YTB', 'VMO', 'VEX')), el, 'Videos', attr='embed')
		self._add_embed_list(model.embed_set.filter(
			kind__in=('GMP', 'BMP', 'MQT', 'MEX')), el, 'Maps', attr='embed')

	def append_to(self, model, root):
		el = Element(tag=self.tag)
		self._add_model_data_to_el(model, el)
		root.append(el)


class Event(XmlToModelConversion):
	tag = 'Crisis'

	def _add_model_data_to_el(self, model, el):
		self._add_relationships(model, el, 'People', 'Person', 'person_set')
		self._add_relationships(model, el, 'Organizations', 'Org',
				'organization_set')
		el.append(e(tag='Kind', text=model.kind))
		el.append(e(tag='Date', text=model.date_time.date()))
		el.append(e(tag='Time', text=model.date_time.time()))
		self._add_field_as_nested_tag(model, el, 'Locations', 'location')
		self._add_field_as_nested_tag(model, el, 'HumanImpact', 'human_impact')
		self._add_field_as_nested_tag(model, el, 'EconomicImpact',
				'economic_impact')
		self._add_field_as_nested_tag(model, el, 'ResourcesNeeded',
				'resources_needed')
		self._add_field_as_nested_tag(model, el, 'WaysToHelp', 'ways_to_help')
		super(Event, self)._add_model_data_to_el(model, el)


class Person(XmlToModelConversion):
	def _add_model_data_to_el(self, model, el):
		self._add_relationships(model, el, 'Crises', 'Crisis', 'event')
		self._add_relationships(model, el, 'Organizations', 'Org',
				'organization_set')
		el.append(e(tag='Kind', text=model.kind))
		el.append(e(tag='Location', text=model.location))
		super(Person, self)._add_model_data_to_el(model, el)


class Organization(XmlToModelConversion):
	def _add_model_data_to_el(self, model, el):
		self._add_relationships(model, el, 'Crises', 'Crisis', 'event')
		self._add_relationships(model, el, 'People', 'Person', 'person')
		el.append(e(tag='Kind', text=model.kind))
		el.append(e(tag='Location', text=model.location))
		self._add_field_as_nested_tag(model, el, 'History', 'history')
		self._add_field_as_nested_tag(model, el, 'ContactInfo', 'contact_info')
		super(Organization, self)._add_model_data_to_el(model, el)


m_to_conv = OrderedDict(
		[('Event', Event), ('Person', Person), ('Organization', Organization)])


def convert():
	root = ElementTree(file=StringIO("<WorldCrises />")).getroot()
	for m, Conv in m_to_conv.items():
		for model in getattr(models, m).objects.all():
			Conv().append_to(model, root)
	return minidom.parseString(tostring(root, encoding='UTF-8')).toprettyxml()
	# return tostring(root, encoding='UTF-8')

