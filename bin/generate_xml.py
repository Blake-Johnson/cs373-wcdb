#!/usr/bin/env python

from os.path import join, basename
from xml.etree.ElementTree import ElementTree, Element, tostring
from StringIO import StringIO
import xml.dom.minidom

import yaml


class Item(object):

    def __init__(self, fname):
        self.id = basename(fname).split('.')[0]
        self.data = yaml.load(open(fname).read())

    def _add_data(self, el):
        el.set('ID', self.id)
        el.set('Name', self.data['name'])

    def append_to(self, root):
        el = Element(tag=self.tag)
        self._add_data(el)
        root.append(el)



class Crisis(Item):
    tag = 'Crisis'

    def _add_relationship(self, el, pluralTag, dataName, singularTag):
        plural = Element(tag=pluralTag)
        for singular in self.data[dataName]:
            singularEl = Element(tag=singularTag)
            singularEl.text = singular
            plural.append(singularEl)
        el.append(plural)

    def _add_data(self, el):
        super(Crisis, self)._add_data(el)
        self._add_relationship(el, 'People', 'people', 'PersonID')
        self._add_relationship(el, 'Organizations', 'organizations',
                'OrganizationID')
        year = Element(tag='Year')
        year.text = str(self.data['date_time'].year)
        el.append(year)


class Person(Item):
    tag = 'Person'


class Organization(Item):
    tag = 'Organization'


classes = {'CRI': Crisis, 'PER': Person, 'ORG': Organization}


def run():
    root = ElementTree(file=StringIO("<WorldCrises />")).getroot()
    for base, dirs, files in os.walk('assets/data'):
        for f in files:
            if f.startswith('.'): continue
            classes[f.split('.')[0][:3]](fname=join(base, f)).append_to(root)
    return root


if __name__ == '__main__':
    print xml.dom.minidom.parseString(tostring(run())).toprettyxml()
