from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'crisis_app.views.index', name='index'),
    url(r'^(?i)about$', 'crisis_app.views.about', name='about'),
    url(r'^(?i)events/(?P<event_pk>\d+)$', 'crisis_app.views.events', name='event'),
    url(r'^(?i)people/(?P<person_pk>\d+)$', 'crisis_app.views.people', name='person'),
    url(r'^(?i)orgs/(?P<org_pk>\d+)$', 'crisis_app.views.orgs', name='org'),
    url(r'^(?i)events$', 'crisis_app.views.events', name='events'),
    url(r'^(?i)people$', 'crisis_app.views.people', name='people'),
    url(r'^(?i)orgs$', 'crisis_app.views.orgs', name='orgs'),
    # url(r'^$', 'crisis.views.home', name='home'),
    # url(r'^crisis/', include('crisis.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
