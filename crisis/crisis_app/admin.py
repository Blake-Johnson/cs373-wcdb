from django.contrib import admin
from crisis_app.models import Event, Person, Organization, Embed, About

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
	filter_horizontal = ('event',)
admin.site.register(Person, PersonAdmin)

class OrganizationAdmin(admin.ModelAdmin):
	list_display = ('name', 'kind', 'location', 'contact_info')
	list_filter = ('kind', 'location')
	search_fields = ('name',)
	filter_horizontal = ('event', 'person')
admin.site.register(Organization, OrganizationAdmin)

class EmbedAdmin(admin.ModelAdmin):
	list_display = ('desc', 'kind', 'url')
	list_filter = ('event', 'person', 'organization')
	search_fields = ('kind',)
	filter_horizontal = ('event', 'person', 'organization')
admin.site.register(Embed, EmbedAdmin)

class AboutAdmin(admin.ModelAdmin):
	list_display = ('first_name', 'last_name', 'github_id', 'role', 'quote')
	search_fields = ('first_name', 'last_name')
admin.site.register(About, AboutAdmin)