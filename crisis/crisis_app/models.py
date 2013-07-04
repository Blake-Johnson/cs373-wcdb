from django.db import models

class Event(models.Model):
	id = models.CharField(max_length=255, unique=True, primary_key=True)
	name = models.CharField(max_length=255)
	kind = models.CharField(max_length=255, verbose_name="type")
	location = models.CharField(max_length=255)
	date_time = models.DateTimeField("date")
	human_impact = models.TextField()
	economic_impact = models.TextField()
	resources_needed = models.TextField()
	ways_to_help = models.TextField()

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Event"
		verbose_name_plural = "Events"
		get_latest_by = "date_time"

class Person(models.Model):
	id = models.CharField(max_length=255, unique=True, primary_key=True)
	name = models.CharField(max_length=255)
	kind = models.CharField(max_length=255, verbose_name="role")
	location = models.CharField(max_length=255)

	event = models.ManyToManyField(Event)

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Person"
		verbose_name_plural = "People"

class Organization(models.Model):
	id = models.CharField(max_length=255, unique=True, primary_key=True)
	name = models.CharField(max_length=255)
	kind = models.CharField(max_length=255, verbose_name="type")
	location = models.CharField(max_length=255)
	contact_info = models.CharField(max_length=255)

	event = models.ManyToManyField(Event)
	person = models.ManyToManyField(Person, blank=True, null=True)

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Organization"
		verbose_name_plural = "Organizations"

class Citation(models.Model):
	id = models.AutoField(unique=True, primary_key=True)
	name = models.CharField(max_length=255, verbose_name="citation")

	event = models.ManyToManyField(Event, blank=True, null=True)
	person = models.ManyToManyField(Person, blank=True, null=True)
	organization = models.ManyToManyField(Organization, blank=True, null=True)

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Citation"
		verbose_name_plural = "Citations"
		get_latest_by = "id"
