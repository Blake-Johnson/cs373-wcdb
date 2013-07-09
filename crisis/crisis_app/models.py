from django.db import models

class Event(models.Model):
	id = models.AutoField(primary_key=True, unique=True)
	xml_id = models.CharField(max_length=6, unique=True, verbose_name="XML ID (CRI_*)")
	name = models.CharField(max_length=255, unique=True, verbose_name="Name")
	kind = models.CharField(max_length=255, verbose_name="Type")
	location = models.CharField(max_length=255, verbose_name="Location of Occurrence")
	date_time = models.DateTimeField(verbose_name="Date/Time (00:00:00 for no time)")
	human_impact = models.TextField(max_length=4096, verbose_name="Human Impact")
	economic_impact = models.TextField(max_length=4096, verbose_name="Economic Impact")
	resources_needed = models.TextField(max_length=4096, verbose_name="Resources Used")
	ways_to_help = models.TextField(max_length=4096, verbose_name="Aid Provided")

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Event"
		verbose_name_plural = "Events"
		get_latest_by = "date_time"

class Person(models.Model):
	id = models.AutoField(primary_key=True, unique=True)
	xml_id = models.CharField(max_length=6, unique=True, verbose_name="XML ID (PER_*)")
	name = models.CharField(max_length=255, unique=True, verbose_name="Name")
	kind = models.CharField(max_length=255, verbose_name="Role")
	location = models.CharField(max_length=255, verbose_name="Primary Location")

	event = models.ManyToManyField(Event, verbose_name="Associated Events")

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Person"
		verbose_name_plural = "People"

class Organization(models.Model):
	id = models.AutoField(primary_key=True, unique=True)
	xml_id = models.CharField(max_length=6, unique=True, verbose_name="XML ID (ORG_*)")
	name = models.CharField(max_length=255, unique=True, verbose_name="Name")
	kind = models.CharField(max_length=255, verbose_name="Type")
	location = models.CharField(max_length=255, verbose_name="Location of Operation")
	contact_info = models.CharField(max_length=255, verbose_name="Contact (Phone/Email/Address/URL)")
	history = models.TextField(max_length=4096, verbose_name="History")

	event = models.ManyToManyField(Event, verbose_name="Associated Events")
	person = models.ManyToManyField(Person, blank=True, null=True, verbose_name="Related People")

	def __unicode__(self):
		return self.name

	class Meta:
		verbose_name = "Organization"
		verbose_name_plural = "Organizations"

class Embed(models.Model):
	id = models.AutoField(primary_key=True, unique=True)
	desc = models.CharField(max_length=255, verbose_name="Human-Readable Description")
	EMBED_CHOICES = (
		("CIT", "Citation"),
		("IMG", "Image"),
		("Video", (
				("YTB", "YouTube"),
				("VMO", "Vimeo"),
				("VEX", "Other")
			)
		),
		("Map", (
				("GMP", "Google Maps"),
				("BMP", "Bing Maps"),
				("MQT", "MapQuest"),
				("MEX", "Other")
			)
		),
		("Feed", (
				("TWT", "Twitter"),
				("FBK", "Facebook"),
				("GPL", "Google+"),
				("FEX", "Other")
			)
		)
	)
	kind = models.CharField(max_length=3, choices=EMBED_CHOICES, default="CIT", verbose_name="Type")
	url = models.URLField(max_length=255, unique="True", verbose_name="Embed URL")

	event = models.ManyToManyField(Event, blank=True, null=True, verbose_name="Related Events")
	person = models.ManyToManyField(Person, blank=True, null=True, verbose_name="Related People")
	organization = models.ManyToManyField(Organization, blank=True, null=True, verbose_name="Related Organizations")

	def __unicode__(self):
		return self.url

	class Meta:
		verbose_name = "Embed"
		verbose_name_plural = "Embeds"
		get_latest_by = "id"

class About(models.Model):
	first_name = models.CharField(max_length=31, verbose_name="First Name")
	last_name = models.CharField(max_length=31, verbose_name="Last Name")
	github_id = models.CharField(max_length=31, unique=True, primary_key=True, verbose_name="GitHub ID")
	role = models.CharField(max_length=255, verbose_name="Role")
	quote = models.CharField(max_length=511, verbose_name="Quote")
	image = models.CharField(max_length=255, verbose_name="Image")

	def __unicode__(self):
		return self.first_name + " " + self.last_name

	class Meta:
		verbose_name = "Author"
		verbose_name_plural = "Authors"
