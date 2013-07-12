from xml.etree.ElementTree import Element, fromstring, tostring
from xml.dom import minidom

OUR_IDS =  ['BMBOMB', 'FUKUSH', 'SYCLWR', 'HURSAN', 'COLSSD',
			'PIRATE', 'EXXVAL', 'BFACTO', 'HAIEAR', 'AIDSHI',

			'BOMBER', 'ABDALA', 'JOSHAZ', 'RENPRE', 'SYRIDE',
			'BROBMA', 'POPEFR', 'CEOTEP',

			'THIOKL', 'GENELE', 'MARORG', 'NATOAA', 'TEPCOM',
			'REDCRS', 'WHORGN', 'NASAUS', 'CATHLC',]

# missing:
# American mechanical engineer Roger Boisjoly
# Russian President Vladimir Putin
# Joint United Nations Programme on HIV/AIDS (UNAIDS)

def prune(xml):
	new_tree = Element('WorldCrises')
	for el in fromstring(xml):
		if el.get('ID').split('_')[-1] in OUR_IDS:
			new_el = fromstring(tostring(el))
			remove_top_level = []
			for child in new_el:
				if child.tag in ['Crises', 'People', 'Organizations']:
					to_remove = []
					for link in child:
						if link.get('ID')[4:] not in OUR_IDS:
							to_remove.append(link)
					[child.remove(l) for l in to_remove]
					if not len(child):
						remove_top_level.append(child)
			[new_el.remove(c) for c in remove_top_level]
			new_tree.append(new_el)
	jacked =  minidom.parseString(tostring(new_tree)).toprettyxml()
	return '\n'.join(l for l in jacked.split('\n') if l.strip())
