from django.shortcuts import render

def my404(request):
	return render(request, 'crisis/404.html')

def my500(request):
	return render(request, 'crisis/500.html')