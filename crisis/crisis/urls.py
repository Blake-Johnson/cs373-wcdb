from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Since crisis is the main site, there is no redirect to an app's urls.py
    url(r'^$', 'crisis_app.views.index', name='index'),
    url(r'^(?i)about$', 'crisis_app.views.about', name='about'),
    url(r'^(?i)events/(?P<event_id>\d+)$', 'crisis_app.views.events', name='event'),
    url(r'^(?i)people/(?P<person_id>\d+)$', 'crisis_app.views.people', name='person'),
    url(r'^(?i)orgs/(?P<org_id>\d+)$', 'crisis_app.views.orgs', name='org'),
    url(r'^(?i)events$', 'crisis_app.views.events', name='events'),
    url(r'^(?i)people$', 'crisis_app.views.people', name='people'),
    url(r'^(?i)orgs$', 'crisis_app.views.orgs', name='orgs'),
    url(r'^(?i)404$', 'crisis.views.my404', name='404'),
    url(r'^(?i)500$', 'crisis.views.my500', name='500'),
    # Examples:
    # url(r'^$', 'crisis.views.home', name='home'),
    # url(r'^crisis/', include('crisis.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

# Directs server error codes to proper views
handler404 = 'crisis.views.my404'
handler500 = 'crisis.views.my500'