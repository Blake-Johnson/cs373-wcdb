from django.shortcuts import render, get_object_or_404
from django.template import RequestContext, loader
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
		image_list = []
		for event in event_list:
			image = Embed.objects.filter(kind="IMG", event__id=event.id)
			if len(image) > 0:
				image_list.append(image[0])
			else:
				image_list.append(None)
		content_list = zip(event_list, image_list)
		context = { 'content_list': content_list, 'type': 'Events', 'dir': 'events' }
		return render(request, 'crisis_app/content.html', context)
	else:
		event = get_object_or_404(Event, id=event_id)
		images = Embed.objects.filter(kind="IMG", event__id=event.id)
		people = Person.objects.filter(event__id=event.id)
		orgs = Organization.objects.filter(event__id=event.id)
		context = { 'event': event, 'images': images, 'people': people, 'orgs': orgs }
		return render(request, 'crisis_app/event.html', context)

def people(request, person_id=None):
	if person_id == None:
		person_list = Person.objects.order_by('name')
		image_list = []
		for person in person_list:
			image = Embed.objects.filter(kind="IMG", person__id=person.id)
			if len(image) > 0:
				image_list.append(image[0])
			else:
				image_list.append(None)
		content_list = zip(person_list, image_list)
		context = { 'content_list': content_list, 'type': 'People', 'dir': 'people' }
		return render(request, 'crisis_app/content.html', context)
	else:
		person = get_object_or_404(Person, id=person_id)
		images = Embed.objects.filter(kind="IMG", person__id=person.id)
		events = Event.objects.filter(person__id=person.id)
		orgs = Organization.objects.filter(person__id=person.id)
		context = { 'person': person, 'images': images, 'events': events, 'orgs': orgs }
		return render(request, 'crisis_app/person.html', context)

def orgs(request, org_id=None):
	if org_id == None:
		org_list = Organization.objects.order_by('name')
		image_list = []
		for org in org_list:
			image = Embed.objects.filter(kind="IMG", organization__id=org.id)
			if len(image) > 0:
				image_list.append(image[0])
			else:
				image_list.append(None)
		content_list = zip(org_list, image_list)
		context = { 'content_list': content_list, 'type': 'Organizations', 'dir': 'orgs' }
		return render(request, 'crisis_app/content.html', context)
	else:
		org = get_object_or_404(Organization, id=org_id)
		images = Embed.objects.filter(kind="IMG", organization__id=org.id)
		events = Event.objects.filter(organization__id=org.id)
		people = Person.objects.filter(organization__id=org.id)
		context = { 'org': org, 'images': images, 'events': events, 'people': people }
		return render(request, 'crisis_app/org.html', context)