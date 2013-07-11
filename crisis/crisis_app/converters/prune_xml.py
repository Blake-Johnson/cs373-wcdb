from xml.etree.ElementTree import Element, fromstring, tostring
from xml.dom import minidom

OUR_IDS =  ['BMBOMB', 'FUKUSH', 'SYCLWR', 'HURSAN', 'COLSSD',
			'PIRATE', 'EXXVAL', 'BFACTO', 'HAIEAR', 'AIDSHI',

			'BOMBER', 'ABDALA', 'JOSHAZ', 'RENPRE', 'SYRIDE',
			'BROBMA', 'POPEFR',

			'THIOKL', 'GENELE', 'MARORG', 'NATOAA', 'TEPCOM',
			'REDCRS', 'WHORGN', 'NASAUS', 'CATHLC',]

# missing:
# CEO of TEPCO Masataka Shimizu
# American mechanical engineer Roger Boisjoly
# Russian President Vladimir Putin
# Joint United Nations Programme on HIV/AIDS (UNAIDS)

def prune(xml):
	new_tree = Element('WorldCrises')
	for el in fromstring(xml):
		if el.get('ID').split('_')[-1] in OUR_IDS:
			new_tree.append(el)
	jacked =  minidom.parseString(tostring(new_tree)).toprettyxml()
	return '\n'.join(l for l in jacked.split('\n') if l.strip())
