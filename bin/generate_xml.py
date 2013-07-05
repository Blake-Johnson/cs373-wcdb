#!/usr/bin/env python

import os
from os.path import join, basename
from xml.etree.ElementTree import ElementTree, Element, tostring
from StringIO import StringIO
from xml.dom import minidom

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
        self._add_relationship(el, 'Organizations', 'organizations', 'OrgID')
        year = Element(tag='Year')
        year.text = str(self.data['date_time'].year)
        el.append(year)


class Person(Item):
    tag = 'Person'

    def _add_data(self, el):
        super(Person, self)._add_data(el)
        born = Element(tag='Born')
        born.text = str(self.data['born'].year)
        el.append(born)
        office = Element(tag='Office')
        office.text = self.data['kind']
        el.append(office)


class Organization(Item):
    tag = 'Organization'


# the order of these is important because xsd is worthless
dirs = ['assets/data/events', 'assets/data/people', 'assets/data/organizations']
classes = {'CRI': Crisis, 'PER': Person, 'ORG': Organization}


def run():
    root = ElementTree(file=StringIO("<WorldCrises />")).getroot()
    for d, files in ((d, os.listdir(d)) for d in dirs):
        for f in files:
            if f.startswith('.'): continue
            classes[f.split('.')[0][:3]](fname=join(d, f)).append_to(root)
    return root


if __name__ == '__main__':
    print minidom.parseString(tostring(run())).toprettyxml()
