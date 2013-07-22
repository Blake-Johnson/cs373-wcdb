doc:
	rm -rf doc
	mkdir doc
	export DJANGO_SETTINGS_MODULE=crisis.settings && \
	export PYTHONPATH="venv/lib/python2.7/site-packages:crisis:crisis_app" && \
	for f in `find . -iname '*.py' | grep -v venv` ; do \
		venv/bin/pydoc -w $$f ; \
		mkdir -p doc/`dirname $$f` ; \
		cp `basename $$f .py`.html doc/`dirname $$f`/ ; \
	done

zip:
	cp crisis_app/tests.py TestWCDB1.py
	git log > WCDB1.log
	cp assets/report/report.pdf WCDB1.pdf
	cp assets/xml/astacy-WCDB1.xml WCDB1.xml
	cp assets/xml/astacy-WCDB1.xsd.xml WCDB1.xsd.xml
	cp assets/tests/djc977-TestWCDB1.out TestWCDB1.out
	zip -r WCDB1.zip doc WCDB1.log WCDB1.pdf crisis crisis_app WCDB1.xml WCDB1.xsd.xml TestWCDB1.py TestWCDB1.out

turnin-list:
	turnin --list bendy cs373pj3

turnin-submit: WCDB1.zip
	turnin --submit bendy cs373pj3 WCDB1.zip

turnin-verify:
	turnin --verify bendy cs373pj3

.PHONY: doc zip turnin-list turnin-submit turnin-verify

test:
	python manage.py test crisis_app

clear-cache:
	rm crisis_app/cache/json
	rm crisis_app/cache/xml