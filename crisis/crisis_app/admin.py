from django.contrib import admin
from crisis_app.models import Event, Person, Organization, Citation, About

class EventAdmin(admin.ModelAdmin):
	list_display = ('name', 'kind', 'location', 'date_time')
	list_filter = ('kind', 'location', 'date_time')
	search_fields = ('name',)
	date_hierarchy = 'date_time'
admin.site.register(Event, EventAdmin)

class PersonAdmin(admin.ModelAdmin):
	list_display = ('name', 'kind', 'location')
	list_filter = ('kind', 'location')
	search_fields = ('name',)
admin.site.register(Person, PersonAdmin)

class OrganizationAdmin(admin.ModelAdmin):
	list_display = ('name', 'kind', 'location', 'contact_info')
	list_filter = ('kind', 'location')
	search_fields = ('name',)
admin.site.register(Organization, OrganizationAdmin)

class CitationAdmin(admin.ModelAdmin):
	list_display = ('name',)
	search_fields = ('name',)
admin.site.register(Citation, CitationAdmin)

class AboutAdmin(admin.ModelAdmin):
	list_display = ('first_name', 'last_name', 'github_id', 'role', 'quote')
	search_fields = ('first_name', 'last_name')
admin.site.register(About, AboutAdmin)