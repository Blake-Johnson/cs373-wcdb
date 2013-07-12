import os, datetime, json, re, types
from subprocess import PIPE, Popen
from StringIO import StringIO

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.db.models import Q
from django import forms
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse

from crisis_app.models import Event, Person, Organization, Embed, About
from crisis_app.converters import to_xml, to_db

XML_CACHE_PATH = 'crisis_app/cache/xml'
JSON_CACHE_PATH = 'crisis_app/cache/json'

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
	Implementation: regex is precompiled to optimize the loop; logic
		is built such that only one column of the table needs to
		contain each part of the query, but each part of the query
		must be found to in one column
	'''
	assert type(query) in [str, int, unicode, tuple, list]
	assert len(query) < 32
	space = re.compile(r'\s{2,}')
	parts = re.compile(r'"([^"]+)"|(\S+)')
	return [space.sub(' ', part[0] or part[1]).strip() for part in parts.findall(query)]

def querify(blocks, cols):
	'''
	Preconditions: a query is provided with the columns of a table
		to search for the existence of those queries
	Postconditions: generates a series of Django Q objects to be
		used in a model search
	Implementation: logic is built such that only one column of the
		table needs to contain each part of the query, but each
		part of the query must be found to in one column
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
		block_query = col_query if block_query is None else (block_query & col_query)
	return block_query

def index(request):
	'''
	If a query request is given (using the GET method), the index
		page treats that as a search and returns results to the
		user
	Otherwise, this function runs through the necessary logic to
		retrieve a JSON string for the splash on the home page
		and sends it to the home.html template
	'''
	try:
		user_query = request.GET['q']
		parsed_query = parse(user_query)
		selections = { 'events': 'e' in request.GET, 'people': 'p' in request.GET, 'orgs': 'o' in request.GET }
		events = people = orgs = []
		if selections['events']:
			logical_query = querify(parsed_query, ['name', 'kind', 'location', 'human_impact', 'economic_impact', 'resources_needed', 'ways_to_help'])
			events = Event.objects.filter(logical_query).order_by('-date_time')
		if selections['people']:
			logical_query = querify(parsed_query, ['name', 'kind', 'location'])
			people = Person.objects.filter(logical_query)
		if selections['orgs']:
			logical_query = querify(parsed_query, ['name', 'kind', 'location', 'contact_info', 'history'])
			orgs = Organization.objects.filter(logical_query)
		context = { 'query': user_query, 'events': events, 'people': people, 'orgs': orgs, 'selections': selections }
		return render(request, 'crisis_app/search.html', context)
	except:
		json = get_json()
		context = { 'json': json }
		return render(request, 'crisis_app/home.html', context)

def about(request):
	'''
	The about page is given a list of site authors or display
		to the user
	'''
	author_list = About.objects.order_by('last_name')
	context = { 'author_list': author_list }
	return render(request, 'crisis_app/about.html', context)

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
		event = get_object_or_404(Event, id=event_id)
		embed = {}
		embed['images'] = Embed.objects.filter(kind="IMG", event__id=event.id)
		embed['videos'] = Embed.objects.filter(kind__in=("YTB", "VMO", "VEX"), event__id=event.id)
		embed['maps'] = Embed.objects.filter(kind__in=("GMP", "BMP", "MPQ", "MEX"), event__id=event.id)
		embed['feeds'] = Embed.objects.filter(kind__in=("TWT", "FBK", "GPL", "FEX"), event__id=event.id)
		embed['citations'] = Embed.objects.filter(kind="CIT", event__id=event.id)
		people = Person.objects.filter(event__id=event.id)
		orgs = Organization.objects.filter(event__id=event.id)
		context = { 'event': event, 'embed': embed, 'people': people, 'orgs': orgs }
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
		person = get_object_or_404(Person, id=person_id)
		embed = {}
		embed['images'] = Embed.objects.filter(kind="IMG", person__id=person.id)
		embed['videos'] = Embed.objects.filter(kind__in=("YTB", "VMO", "VEX"), person__id=person.id)
		embed['maps'] = Embed.objects.filter(kind__in=("GMP", "BMP", "MPQ", "MEX"), person__id=person.id)
		embed['feeds'] = Embed.objects.filter(kind__in=("TWT", "FBK", "GPL", "FEX"), person__id=person.id)
		embed['citations'] = Embed.objects.filter(kind="CIT", person__id=person.id)
		events = Event.objects.filter(person__id=person.id)
		orgs = Organization.objects.filter(person__id=person.id)
		context = { 'person': person, 'embed': embed, 'events': events, 'orgs': orgs }
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
		org = get_object_or_404(Organization, id=org_id)
		embed = {}
		embed['images'] = Embed.objects.filter(kind="IMG", organization__id=org.id)
		embed['videos'] = Embed.objects.filter(kind__in=("YTB", "VMO", "VEX"), organization__id=org.id)
		embed['maps'] = Embed.objects.filter(kind__in=("GMP", "BMP", "MPQ", "MEX"), organization__id=org.id)
		embed['feeds'] = Embed.objects.filter(kind__in=("TWT", "FBK", "GPL", "FEX"), organization__id=org.id)
		embed['citations'] = Embed.objects.filter(kind="CIT", organization__id=org.id)
		events = Event.objects.filter(organization__id=org.id)
		people = Person.objects.filter(organization__id=org.id)
		context = { 'org': org, 'embed': embed, 'events': events, 'people': people }
		return render(request, 'crisis_app/org.html', context)

def invalidate_xml_cache():
	if os.path.exists(XML_CACHE_PATH):
		os.remove(XML_CACHE_PATH)


def raw_xml(request):
	'''
	This code exists to test the XML conversion for deploying to the public database
	It needs to be password protected
	'''
	path = XML_CACHE_PATH
	try:
		xml_info = open(XML_CACHE_PATH, 'r+')
		date_created = datetime.datetime.strptime(xml_info.readline(), '%m-%d-%Y %H:%M:%S\n')
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
			return # the 'required' part of the xml attr will report the error
		xmllint = Popen('''
			xmllint --noout --schema crisis_app/static/WorldCrises.xsd.xml -
		'''.strip().split(), stdin=PIPE, stdout=PIPE, stderr=PIPE)
		xmllint.stdin.write(self['xml'].value().read())
		stdout, stderr = xmllint.communicate()
		if xmllint.returncode:
			raise forms.ValidationError('XML is invalid:\n' + stderr)

@login_required(login_url='/login')
def xml(request):
	if request.POST:
		form = XmlUploadForm(request.POST, request.FILES)
		if form.is_valid():
			f = form['xml'].value()
			f.seek(0)
			to_db.convert(f.read())
			invalidate_xml_cache()
			return HttpResponseRedirect('/data.xml')
	else:
		form = XmlUploadForm()
	return render(request, 'crisis_app/xml.html', {'form': form})

class LoginForm(forms.Form):
	username = forms.CharField(required=True)
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
