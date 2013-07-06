from django.shortcuts import render
from django.template import RequestContext, loader

def my404(request):
	return render(request, 'crisis/404.html')