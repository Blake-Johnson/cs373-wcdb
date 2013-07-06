from django.shortcuts import render

def my404(request):
	return render(request, 'crisis/404.html')