from django.contrib import admin

from crisis_app.models import Event, Person, Organization, Embed, About

'''
Registering custom models in admin.py allows their access and modification
	in the admin section of the site
The first element in list_display is the link to the edit page, so it is
	specifically chosen to be a unique entry
ManyToMany fields are filtered horizontaly for ease of use
Search options are limited to a table's most important column to prevent
	abuse of the server's resources
'''

class EventAdmin(admin.ModelAdmin):
	'''
	Provides custom options for the Event table in the Admin interface
	'''
	list_display = ('name', 'kind', 'location', 'date_time')
	list_filter = ('kind', 'person', 'organization')
	list_editable = ('kind', 'location')
	search_fields = ('name',)
	date_hierarchy = 'date_time'
admin.site.register(Event, EventAdmin)

class PersonAdmin(admin.ModelAdmin):
	'''
	Provides custom options for the Person table in the Admin interface
	'''
	list_display = ('name', 'kind', 'location')
	list_filter = ('event', 'organization')
	list_editable = ('kind', 'location')
	search_fields = ('name',)
	filter_horizontal = ('event',)
admin.site.register(Person, PersonAdmin)

class OrganizationAdmin(admin.ModelAdmin):
	'''
	Provides custom options for the Organization table in the Admin interface
	'''
	list_display = ('name', 'kind', 'location', 'contact_info')
	list_filter = ('event', 'person')
	list_editable = ('kind', 'location', 'contact_info')
	search_fields = ('name',)
	filter_horizontal = ('event', 'person')
admin.site.register(Organization, OrganizationAdmin)

class EmbedAdmin(admin.ModelAdmin):
	'''
	Provides custom options for the Organization table in the Admin interface
	'''
	fieldsets = (
		(None, { 'fields': ('kind', 'url', 'desc') }),
		('Relations', { 'fields': ('event', 'person', 'organization') })
	)
	list_display = ('desc', 'kind', 'url')
	list_filter = ('event', 'person', 'organization')
	list_editable = ('kind', 'url')
	search_fields = ('kind',)
	filter_horizontal = ('event', 'person', 'organization')
admin.site.register(Embed, EmbedAdmin)

class AboutAdmin(admin.ModelAdmin):
	'''
	Provides custom options for the About table in the Admin interface
	'''
	list_display = ('__unicode__', 'github_id', 'role', 'quote')
	list_editable = ('role', 'quote')
	search_fields = ('first_name', 'last_name')
admin.site.register(About, AboutAdmin)
