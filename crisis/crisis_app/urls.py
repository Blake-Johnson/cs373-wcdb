from django.conf.urls import patterns, url
from crisis_app import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
)
