from django.shortcuts import render, get_object_or_404
from django.template import RequestContext, loader
from crisis_app.models import Event, Person, Organization, Embed, About

def index(request):
	return render(request, 'crisis_app/home.html')

def about(request):
	author_list = About.objects.order_by('last_name')
	context = { 'author_list': author_list }
	return render(request, 'crisis_app/about.html', context)

def events(request, event_id=''):
	if event_id == '':
		event_list = Event.objects.order_by('date_time')
		image_list = []
		for event in event_list:
			image = Embed.objects.filter(kind="IMG", event__id=event.id)
			if len(image) > 0:
				image_list.append(image[0])
			else:
				image_list.append('')
		content_list = zip(event_list, image_list)
		context = { 'content_list': content_list, 'type': 'Events', 'dir': 'events' }
		return render(request, 'crisis_app/content.html', context)
	else:
		event = get_object_or_404(Event, id=event_id)
		image = Embed.objects.filter(kind="IMG", event__id=event.id)
		if len(image) == 0:
			image = ''
		else:
			image = image[0]
		context = { 'event': event, 'image': image }
		return render(request, 'crisis_app/event.html', context)

def people(request, person_id=''):
	if person_id == '':
		person_list = Person.objects.order_by('name')
		image_list = []
		for person in person_list:
			image = Embed.objects.filter(kind="IMG", person__id=person.id)
			if len(image) > 0:
				image_list.append(image[0])
			else:
				image_list.append('')
		content_list = zip(person_list, image_list)
		context = { 'content_list': content_list, 'type': 'People', 'dir': 'people' }
		return render(request, 'crisis_app/content.html', context)
	else:
		person = get_object_or_404(Person, id=person_id)
		image = Embed.objects.filter(kind="IMG", person__id=person.id)
		if len(image) == 0:
			image = ''
		else:
			image = image[0]
		context = { 'person': person, 'image': image }
		return render(request, 'crisis_app/person.html', context)

def orgs(request, org_id=''):
	if org_id == '':
		org_list = Organization.objects.order_by('name')
		image_list = []
		for org in org_list:
			image = Embed.objects.filter(kind="IMG", organization__id=org.id)
			if len(image) > 0:
				image_list.append(image[0])
			else:
				image_list.append('')
		content_list = zip(org_list, image_list)
		context = { 'content_list': content_list, 'type': 'Organizations', 'dir': 'orgs' }
		return render(request, 'crisis_app/content.html', context)
	else:
		org = get_object_or_404(Organization, id=org_id)
		image = Embed.objects.filter(kind="IMG", organization__id=org.id)
		if len(image) == 0:
			image = ''
		else:
			image = image[0]
		context = { 'org': org, 'image': image }
		return render(request, 'crisis_app/org.html', context)