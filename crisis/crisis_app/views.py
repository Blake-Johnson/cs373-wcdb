from django.shortcuts import render, get_object_or_404
from django.template import RequestContext, loader
from crisis_app.models import Event, Person, Organization, About

def index(request):
	return render(request, 'crisis_app/home.html')

def about(request):
	author_list = About.objects.all().order_by('last_name')
	context = { 'author_list': author_list }
	return render(request, 'crisis_app/about.html', context)

def events(request, event_pk=''):
	if(event_pk == ''):
		content_list = Event.objects.all().order_by('date_time')
		context = { 'content_list': content_list, 'type': 'Events', 'dir': 'events' }
		return render(request, 'crisis_app/content.html', context)
	else:
		event = get_object_or_404(Event, pk=event_pk)
		context = { 'event': event }
		return render(request, 'crisis_app/event.html', context)

def people(request, person_pk=''):
	if(person_pk == ''):
		content_list = Person.objects.all().order_by('name')
		context = { 'content_list': content_list, 'type': 'People', 'dir': 'people' }
		return render(request, 'crisis_app/content.html', context)
	else:
		person = get_object_or_404(Person, pk=person_pk)
		context = { 'person': person }
		return render(request, 'crisis_app/person.html', context)

def orgs(request, org_pk=''):
	if(org_pk == ''):
		content_list = Organization.objects.all().order_by('name')
		context = { 'content_list': content_list, 'type': 'Organizations', 'dir': 'orgs' }
		return render(request, 'crisis_app/content.html', context)
	else:
		org = get_object_or_404(Organization, pk=org_pk)
		context = { 'org': org }
		return render(request, 'crisis_app/org.html', context)