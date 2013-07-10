from django.shortcuts import render

def my404(request):
	'''
	Renders the 404 page when the user attempts to access
		information or data that does not exist
	Called from crisis/urls.py
	'''
	return render(request, 'crisis/404.html')

def my500(request):
	'''
	Renders the 500 page when an internal server error occurs
	Called from crisis/urls.py
	'''
	return render(request, 'crisis/500.html')

def login(request):
	'''
	Provides an authentication method for site managers
	Authenticated users will have access to generally
		restricted areas of the site, such as the
		manage page
	'''
	return render(request, 'crisis/login.html')

def logout(request):
	'''
	'''
	return render(request, 'crisis/logout.html')

def manage(request):
	'''
	'''
	return render(request, 'crisis/manage.html')