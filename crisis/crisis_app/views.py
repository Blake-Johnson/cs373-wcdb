from django.shortcuts import render, get_object_or_404
from crisis_app.models import Event, Person, Organization, Embed, About

def index(request):
	return render(request, 'crisis_app/home.html')

def about(request):
	author_list = About.objects.order_by('last_name')
	context = { 'author_list': author_list }
	return render(request, 'crisis_app/about.html', context)

def events(request, event_id=None):
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