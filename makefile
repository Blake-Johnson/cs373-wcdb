test: venv
	source venv/bin/activate && python manage.py test

test-app: venv
	source venv/bin/activate && python manage.py test crisis_app

clear-cache:
	rm crisis_app/cache/json
	rm crisis_app/cache/xml

run: venv
	source venv/bin/activate && python manage.py runserver

WCDB2.log:
	git log > $@

WCDB2.xml:
	cp assets/xml/astacy-WCDB1.xml $@

WCDB2.xsd.xml:
	cp assets/xml/astacy-WCDB1.xsd.xml $@

TestWCDB2.out:
	python TestWCDB2.py 2>&1 | tee $@

WCDB2.zip: doc/html WCDB2.log WCDB2.xml WCDB2.xsd.xml TestWCDB2.out
	zip -r WCDB2.zip makefile requirements.txt manage.py doc/html WCDB2.log WCDB2.pdf crisis crisis_app WCDB2.xml WCDB2.xsd.xml TestWCDB2.py TestWCDB2.out

zip: WCDB2.zip

turnin-list:
	turnin --list bendy cs373pj3

turnin-submit: WCDB2.zip
	turnin --submit bendy cs373pj3 WCDB2.zip

turnin-verify:
	turnin --verify bendy cs373pj3

venv:
	virtualenv $@ --distribute
	source $@/bin/activate && pip install -r requirements.txt

doc/html: venv
	source venv/bin/activate && \
	sphinx-apidoc -o doc crisis && \
	sphinx-apidoc -o doc crisis_app && \
	sphinx-build doc $@

docs: doc/html
	source venv/bin/activate && cd doc/html && python -m SimpleHTTPServer

clean-docs:
	rm -rf doc/html doc/crisis*rst

verify: WCDB2.zip
	mkdir ../cs373-wcdb-verify && \
	cp $< ../cs373-wcdb-verify/ && \
	cd ../cs373-wcdb-verify && \
	unzip $< && \
	make test-app

clean: clean-docs clear-cache
	rm -f TestWCDB*.out WCDB*.xml WCDB*.xsd.xml WCDB*.zip

.PHONY: zip turnin-list turnin-submit turnin-verify clean-docs clean
