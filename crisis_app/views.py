import os, datetime, json, re, types, cgi
from subprocess import PIPE, Popen
from StringIO import StringIO

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.db.models import Q
from django import template
from django.template import *
from django import forms
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse

from crisis_app.models import Event, Person, Organization, Embed, About
from crisis_app.converters import to_xml, to_db

from minixsv.pyxsval import parseAndValidateXmlInputString

XML_CACHE_PATH = 'crisis_app/cache/xml'
JSON_CACHE_PATH = 'crisis_app/cache/json'
XSD = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
	'fixtures/xml/wcdb_schema.xsd.xml')).read()

class OutdatedException(Exception):
	'''
	Extension of Exception created primarly to be raised when the JSON
		cache needs to be rebuilt; see the implementation below for
		the threshold when an OutdatedException is raised
	'''
	pass

def make_parent(name, color):
	'''
	Preconditions: a name (string) and color (string) are provided
	Postconditions: a dictionary is returned containing the relevant
		information for a parent node in a JSON tree representing
		data from the Django models
	The $area is initialized to 0; it will be increased over time as
		nodes are added to the parent node
	'''
	assert type(name) in [str, int, unicode, tuple]
	assert type(color) in [str, int, unicode, tuple, list]
	return {
		'id': name,
		'data': { '$color': color, '$area': 0 },
		'children': []
	}

def add_child(parent, name, color, area, image, desc):
	'''
	Preconditions: a parent node is provided, along with sufficient
		information to append a new child to that parent
	Postconditions: a new child is appended to the parent node with
		data consisting of the parameters passed into the function
	'''
	assert type(parent) is dict
	assert type(name) in [str, int, unicode]
	assert type(color) is str
	assert type(area) is int
	# assert type(image) is [need to do this one]
	assert type(desc) in [str, int, unicode]
	parent['children'].append({
		'id': name,
		'data': {
			'$color': color,
			'$area': area,
			'popularity': area,
			'image': str(None if len(image) == 0 else image[0]),
			'description': desc
		}
	})

def make_json(num_elements):
	'''
	Preconditions: the number of elements for each parent (events,
		people, and organizations) is provided
	Postconditions: returns a JSON string formatted for the splash
		on the home page
	'''
	assert type(num_elements) is int
	color_scheme = {
		'root': '#222',
		'event_title': '#6eba08',
		'event_content': '#489500',
		'people_title': '#d64569',
		'people_content': '#a20041',
		'organizations_title': '#dfd900',
		'organizations_content': '#a2a217'
	}
	events = make_parent('Events', color_scheme['event_title'])
	people = make_parent('People', color_scheme['people_title'])
	organizations = make_parent('Organizations', color_scheme['organizations_title'])

	children = Event.objects.all()[:num_elements]
	for child in children:
		image = Embed.objects.filter(kind="IMG", event__id=child.id)
		desc = child.human_impact + '<a href="/events/' + str(child.id) + '"><p>Read more . . .</p></a>'
		area = len(desc)
		add_child(events, child.name, color_scheme['event_content'], area, image, desc)
		events['data']['$area'] += area
	events['data']['popularity'] = events['data']['$area']

	children = Person.objects.all()[:num_elements]
	for child in children:
		image = Embed.objects.filter(kind="IMG", person__id=child.id)
		desc = child.kind + ': ' + child.location + '<a href="/people/' + str(child.id) + '"><p>Read more . . .</p></a>'
		area = len(desc) * 10
		add_child(people, child.name, color_scheme['people_content'], area, image, desc)
		people['data']['$area'] += area
	people['data']['popularity'] = people['data']['$area']

	children = Organization.objects.all()[:num_elements]
	for child in children:
		image = Embed.objects.filter(kind="IMG", organization__id=child.id)
		desc = child.history + '<a href="/orgs/' + str(child.id) + '"><p>Read more . . .</p></a>'
		area = len(desc)
		add_child(organizations, child.name, color_scheme['organizations_content'], area, image, desc)
		organizations['data']['$area'] += area
	organizations['data']['popularity'] = organizations['data']['$area']

	total_area = events['data']['$area'] + people['data']['$area'] + organizations['data']['$area']
	return json.dumps({
		"id": "Crisis",
		"data": { "$color": color_scheme['root'], "$area": total_area },
		"children": [events, people, organizations]
	}, ensure_ascii=True, encoding='utf-8')

def get_json():
	'''
	Preconditions: None - recommended that a JSON file already exist
		in the JSON_CACHE_PATH to optimize performance
	Postconditions: a JSON string for the splash on the home page is
		either generated with make_json() (if the file does not exist,
		or if the file is outdated) or loaded from the cache file
		(if the file is not outdated); this string is then returned
		to the caller
	Since make_json() is extremely expensive, any JSON files created
		are cached for one day; get_json() ensures that if the JSON
		file was created less than one day ago, the JSON string is
		loaded from the file rather than re-generated
	'''
	if not os.path.isdir(os.path.dirname(JSON_CACHE_PATH)):
		os.mkdir(os.path.dirname(JSON_CACHE_PATH))
	try:
		json_info = open(JSON_CACHE_PATH, 'r+')
		date_created = datetime.datetime.strptime(json_info.readline(), '%m-%d-%Y %H:%M:%S\n')
		json = json_info.readline()
		if date_created + datetime.timedelta(days=1) < datetime.datetime.now() or json == '':
			json_info.close()
			raise OutdatedException('The file ' + JSON_CACHE_PATH + ' is outdated.')
	except:
		json_info = open(JSON_CACHE_PATH, 'w')
		json_info.write(datetime.datetime.strftime(datetime.datetime.now(), '%m-%d-%Y %H:%M:%S') + '\n')
		json = make_json(5)
		json_info.write(json)
	json_info.close()
	return json

def parse(query):
	'''
	Preconditions: a query is provided
	Postconditions: the query is parsed into logical units to
		be querified (see below)
	Implementation: regex is precompiled to optimize the loop; The
		parser is aware of grouped phrases, so the query "us president
		\"barack obama\"" is parsed into the list ["us", "president", 
		"barack obama"]
	'''
	assert type(query) in [str, int, unicode, tuple, list]
	assert len(query) < 32
	space = re.compile(r'\s{2,}')
	parts = re.compile(r'"([^"]+)"|(\S+)')
	return [space.sub(' ', part[0] or part[1]).strip() for part in parts.findall(query)]

def querify(blocks, cols, search_type):
	'''
	Preconditions: a query is provided with the columns of a table
		to search for the existence of those queries; a search type
		is also provided (see below for how to specify search types)
	Postconditions: generates a series of Django Q objects to be
		used in a model search
	Implementation: logic is built such that only one column of the
		table needs to contain each part of the query, but each
		part of the query must be found to in one column
	Search types: 0 for 'or' searches, 1 for 'and' searches
	'''
	assert type(blocks) is list
	assert type(cols) is list
	block_query = None
	for block in blocks:
		col_query = None
		for col in cols:
			q = Q(**{"%s__icontains" % col: block})
			# block just needs to be found in one of the columns
			col_query = q if col_query is None else (col_query | q)
		# all terms need to be found at least once
		block_query = col_query if block_query is None else (block_query & col_query) if search_type else (block_query | col_query)
	return block_query

def get_results(table, and_query, or_query, ordering='Relevance'):
	'''
	Given a table to lookup along with the and and or versions
		of Django's Q objects, the two queries are conducted
		and the results are ordered such that 'and' queries
		are returned prior to 'or' queries
	By default, there is no ordering, however if one is
		specified then the 'and' and 'or' query separation
		is lost
	'''
	results = table.objects.filter(and_query) # 'and' results
	or_results = table.objects.filter(or_query)
	if not ordering == 'relevance':
		results = results.order_by(ordering)
		or_results = or_results.order_by(ordering)
	for or_res in or_results:
		if not or_res in results:
			results._result_cache.append(or_res)
	return results

def index(request):
	'''
	If a query request is given (using the GET method), the index
		page treats that as a search and returns results to the
		user
	Otherwise, this function runs through the necessary logic to
		retrieve a JSON string for the splash on the home page
		and sends it to the home.html template
	'''
	if 'q' in request.GET:
		user_query = request.GET['q']
		if 't' in request.GET:
			query_type = request.GET['t']
		else:
			query_type = 'events'
		parsed_query = parse(user_query)
		events = people = orgs = []
		if query_type == 'events':
			and_query = querify(parsed_query, ['name', 'kind', 'location', 'human_impact', 'economic_impact', 'resources_needed', 'ways_to_help'], 1)
			or_query = querify(parsed_query, ['name', 'kind', 'location', 'human_impact', 'economic_impact', 'resources_needed', 'ways_to_help'], 0)
			sort = { 'relevance': 'Relevance', 'name': 'Name (descending)', '-name': 'Name (ascending)', '-date_time': 'Date (newest - oldest)', 'date_time': 'Date (oldest - newest)' }
			view = request.GET['v'] if 'v' in request.GET else 'relevance'
			results = get_results(Event, and_query, or_query, view)
		elif query_type == 'people':
			and_query = querify(parsed_query, ['name', 'kind', 'location'], 1)
			or_query = querify(parsed_query, ['name', 'kind', 'location'], 0)
			sort = { 'relevance': 'Relevance', 'name': 'Name (descending)', '-name': 'Name (ascending)' }
			view = request.GET['v'] if 'v' in request.GET else 'relevance'
			results = get_results(Person, and_query, or_query, view)
		elif query_type == 'orgs':
			and_query = querify(parsed_query, ['name', 'kind', 'location', 'contact_info', 'history'], 1)
			or_query = querify(parsed_query, ['name', 'kind', 'location', 'contact_info', 'history'], 0)
			sort = { 'relevance': 'Relevance', 'name': 'Name (descending)', '-name': 'Name (ascending)' }
			view = request.GET['v'] if 'v' in request.GET else 'relevance'
			results = get_results(Organization, and_query, or_query, view)
		context = { 'query': user_query, 'type': query_type, 'results': results, 'view': view, 'sort': sort }
		return render(request, 'crisis_app/search.html', context, context_instance=RequestContext(request))
	else:
		json = get_json()
		context = { 'json': json }
		return render(request, 'crisis_app/home.html', context)

def about(request):
	'''
	The about page is given a list of site authors or display
		to the user
	'''
	author_list = About.objects.order_by('last_name')
	context = { 'author_list': author_list}
	return render(request, 'crisis_app/about.html', context)

def youtube_to_embed(url, name):
	'''
	This function is called on url columns in the Embed table for
		videos
	If a video in the proper format is encountered,
		then it is converted to an embed in the webpage rather
		than the standard anchor
	If the function is unable to convert the link provided to an
		embed, it attempts to provide information about the video's
		source
	'''
	url = cgi.escape(url)
	name = cgi.escape(name)
	match = re.search(r'^(?:http|https)\:\/\/www\.youtube\.com\/(?:watch\?(?:feature\=[a-z_]*&)?v\=|embed\/)([\w\-]*)(?:\&(?:.*))?$', url)
	if match:
		embed_url = 'http://www.youtube.com/embed/%s' %(match.group(1))
		res = '<iframe width="560" height="315" src="%s" frameborder="0" name="%s?wmode=opaque" allowfullscreen></iframe>' %(embed_url, name)
	else:
		match = re.search(r'(?:(?:http|https)\:\/\/|www\.)(?:www\.)?(.*?)\.com', url)
		if match:
			res = '<a href="%s">%s (%s)</a><br />' %(url, name, match.group(1).capitalize())
		else:
			res = '<a href="%s">%s</a><br />' %(url, name)
	return res

def mark_anchors(text):
	'''
	Given a text representing an organization's contact information,
		this function attempts to convert as much of the text as
		possible into anchor tags
	The function currently works with emails and obvious URLs
	In the following examples, text -> anchor implies that a text is
		converted to a specific anchor tag:
		noone@nowhere.com -> <a href="mailto:noone@nowhere.com" target="_blank">noone@nowhere.com</a>
		http://bing.com -> <a href="http://bing.com" target="_blank">http://bing.com</a>
		google.com -> <a href="http://google.com" target="_blank">http://google.com</a>
	'''
	text = cgi.escape(text)
	match = re.findall(r'(?:(?:http|https)\://|[a-zA-Z0-9]+@)?[a-zA-Z0-9\-\.]+\.[a-z]{2,3}/?(?:[a-zA-Z0-9\-\._\?\'/\\\+&amp;%\$#\=~])*', text)
	if match:
		matched = set()
		for url in match:
			if not url in matched:
				matched.add(url)
				if url.find('@') > 0:
					replace = 'mailto:' + url
				elif not url.startswith('http://') and not url.startswith('https://'):
					replace = 'http://' + url
				else:
					replace = url
				text = text.replace(url, '<a href="%s" target="_blank">%s<span></span></a>' %(replace, url))
	return text

def make_embed(element):
	'''
	Given an element, this function grabs all the embedded content
		for that element
	Currently, only the Event, Person, and Organization tables are
		supported; to support more table, add them to the category
		field below and ensure that there exist the necessary
		relations with the embed table
	'''
	assert type(element) in [Event, Person, Organization]
	category = { Event: 'event', Person: 'person', Organization: 'organization' }
	arg = { '%s__id' % category[type(element)]: element.id }
	embed = {}
	embed['images'] = Embed.objects.filter(kind="IMG", **arg)
	embed['videos'] = Embed.objects.filter(kind__in=("YTB", "VMO", "VEX"), **arg)
	for video in embed['videos']:
		video.url = youtube_to_embed(video.url, video.desc)
	embed['maps'] = Embed.objects.filter(kind__in=("GMP", "BMP", "MPQ", "MEX"), **arg)
	embed['feeds'] = Embed.objects.filter(kind__in=("TWT", "FBK", "GPL", "FEX"), **arg)
	embed['citations'] = Embed.objects.filter(kind="CIT", **arg)
	return embed

def get_entry(table, id, attrs=()):
	'''
	Given a Django model, an id to index that model, and attributes
		of the model, get_entry will retrieve that entry from the
		model and properly mark the entries of the model provided
	'''
	entry = get_object_or_404(table, id=id)
	for attr in attrs:
		setattr(entry, attr, mark_anchors(getattr(entry, attr)))
	return entry

def get_entries(table, relation, attrs=()):
	'''
	Similar to get_entry, except get_entries will retrieve all
		rows in a Django model which correspond to a relational
		requirement rather than just returning one entry.
	'''
	entries = table.objects.filter(**relation)
	for entry in entries:
		for attr in attrs:
			setattr(entry, attr, mark_anchors(getattr(entry, attr)))
	return entries

def events(request, event_id=None):
	'''
	If called with no event ID, this function loads a list of all
		events in the Event model
	If called with an event ID, this function loads a content page
		about the event
	'''
	if event_id == None:
		event_list = Event.objects.order_by('date_time')
		content_list = []
		for event in event_list:
			image = Embed.objects.filter(kind="IMG", event__id=event.id)
			content_list.append((event, None if len(image) == 0 else image[0]))
		context = { 'content_list': content_list, 'type': 'Events', 'dir': 'events' }
		return render(request, 'crisis_app/list.html', context)
	else:
		event = get_entry(Event, event_id, ('human_impact', 'economic_impact', 'resources_needed', 'ways_to_help'))
		people = get_entries(Person, { 'event__id': event.id })
		orgs = get_entries(Organization, { 'event__id': event.id }, ('history',))
		embed = make_embed(event)
		context = { 'event': event, 'embed': embed, 'people': people, 'orgs': orgs, 'type': 'e' }
		return render(request, 'crisis_app/event.html', context)

def people(request, person_id=None):
	'''
	If called with no person ID, this function loads a list of all
		people in the Person model
	If called with a person ID, this function loads a content page
		about the person
	'''
	if person_id == None:
		person_list = Person.objects.order_by('name')
		content_list = []
		for person in person_list:
			image = Embed.objects.filter(kind="IMG", person__id=person.id)
			content_list.append((person, None if len(image) == 0 else image[0]))
		context = { 'content_list': content_list, 'type': 'People', 'dir': 'people' }
		return render(request, 'crisis_app/list.html', context)
	else:
		person = get_entry(Person, person_id)
		events = get_entries(Event, { 'person__id': person.id }, ('human_impact',))
		orgs = get_entries(Organization, { 'person__id': person.id }, ('history',))
		embed = make_embed(person)
		context = { 'person': person, 'embed': embed, 'events': events, 'orgs': orgs, 'type': 'p' }
		return render(request, 'crisis_app/person.html', context)

def orgs(request, org_id=None):
	'''
	If called with no organization ID, this function loads a list of all
		organizations in the Organization model
	If called with an organization ID, this function loads a content page
		about the organization
	'''
	if org_id == None:
		org_list = Organization.objects.order_by('name')
		content_list = []
		for org in org_list:
			image = Embed.objects.filter(kind="IMG", organization__id=org.id)
			content_list.append((org, None if len(image) == 0 else image[0]))
		context = { 'content_list': content_list, 'type': 'Organizations', 'dir': 'orgs' }
		return render(request, 'crisis_app/list.html', context)
	else:
		org = get_entry(Organization, org_id, ('history', 'contact_info'))
		events = get_entries(Event, { 'organization__id': org.id }, ('human_impact',))
		people = get_entries(Person, { 'organization__id': org.id })
		embed = make_embed(org)
		context = { 'org': org, 'embed': embed, 'events': events, 'people': people, 'type': 'o' }
		return render(request, 'crisis_app/org.html', context)

def remove_xml_cache():
	if os.path.exists(XML_CACHE_PATH):
		os.remove(XML_CACHE_PATH)

def xml(request):
	path = XML_CACHE_PATH
	if not os.path.isdir(os.path.dirname(path)):
		os.mkdir(os.path.dirname(path))
	try:
		xml_info = open(XML_CACHE_PATH, 'r+')
		date_created = datetime.datetime.strptime(xml_info.readline(), '%m-%d-%Y %H:%M:%S\n')
		# For this project XML is not expected to go > 2 MB
		xml = xml_info.read(2097152)
		if date_created + datetime.timedelta(hours=1) < datetime.datetime.now() or xml == '':
			xml_info.close()
			raise OutdatedException('The file ' + XML_CACHE_PATH + ' is outdated.')
	except:
		xml_info = open(XML_CACHE_PATH, 'w')
		xml_info.write(datetime.datetime.strftime(datetime.datetime.now(), '%m-%d-%Y %H:%M:%S') + '\n')
		xml = to_xml.convert()
		xml_info.write(xml.encode('utf8'))
	xml_info.close()
	return HttpResponse(content=xml, mimetype='application/xml')

class XmlUploadForm(forms.Form):
	xml = forms.FileField(required=True)

	def clean(self):
		super(XmlUploadForm, self).clean()
		if not self['xml'].value():
			# the 'required' part of the xml attrribute will report the error
			return
		try:
			ret = parseAndValidateXmlInputString(
					inputText=self['xml'].value().read(), xsdText=XSD)
		except Exception as e:
			raise forms.ValidationError('XML is invalid:\n' + e.message)

@login_required(login_url='/login')
def upload_xml(request):
	if request.POST:
		form = XmlUploadForm(request.POST, request.FILES)
		if form.is_valid():
			f = form['xml'].value()
			f.seek(0)
			try:
				to_db.convert(f.read())
				remove_xml_cache()
				return HttpResponseRedirect('/xml')
			except Exception as e:
				form._errors.setdefault('__all__', forms.util.ErrorList())
				form._errors['__all__'].append(form.error_class([
					'Could not save data:\n' + e.message]))
	else:
		form = XmlUploadForm()
	return render(request, 'crisis_app/xml_upload.html', {'form': form})

class LoginForm(forms.Form):
	username = forms.CharField(required=True, widget=forms.TextInput(attrs={'autofocus': 'autofocus'}))
	password = forms.CharField(required=True, widget=forms.PasswordInput)

	def clean(self):
		super(LoginForm, self).clean()
		self.user = authenticate(username=self['username'].value(),
								 password=self['password'].value())
		if self.user is None:
			raise forms.ValidationError('Invalid username or password')
		if not self.user.is_active:
			raise forms.ValidationError('User is not active')

def login_view(request):
	if request.POST:
		form = LoginForm(request.POST)
		if form.is_valid():
			login(request, form.user)
			if 'next' in request.GET:
				return HttpResponseRedirect(request.GET['next'])
			else:
				return HttpResponseRedirect('/')
	else:
		form = LoginForm()
	return render(request, 'crisis_app/login.html', {
		'form': form,
		'request': request
	})

def logout_view(request):
	logout(request)
	return HttpResponseRedirect('/')
