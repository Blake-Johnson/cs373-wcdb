from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from crisis_app.models import Event

def index(request):
	return render(request, 'crisis_app/home.html')