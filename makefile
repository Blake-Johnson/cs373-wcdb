SHELL=bash

test: venv
	source venv/bin/activate && python manage.py test

test-app: venv
	source venv/bin/activate && python manage.py test crisis_app

clear-cache:
	rm crisis_app/cache/json
	rm crisis_app/cache/xml

run: venv
	source venv/bin/activate && python manage.py runserver

WCDB3.log:
	git log > $@

WCDB3.xml:
	cp assets/xml/astacy-WCDB3.xml $@

WCDB3.xsd.xml:
	cp assets/xml/astacy-WCDB3.xsd.xml $@

TestWCDB3.out:
	python TestWCDB3.py 2>&1 | tee $@

WCDB3.zip: doc/html WCDB3.log WCDB3.xml WCDB3.xsd.xml TestWCDB3.out
	zip -r WCDB3.zip makefile requirements.txt manage.py doc/html WCDB3.log WCDB3.pdf crisis crisis_app WCDB3.xml WCDB3.xsd.xml TestWCDB3.py TestWCDB3.out

zip: WCDB3.zip

turnin-list:
	turnin --list bendy cs373pj5

turnin-submit: WCDB3.zip
	turnin --submit bendy cs373pj5 WCDB3.zip

turnin-verify:
	turnin --verify bendy cs373pj5

venv:
	virtualenv $@ --distribute
	source $@/bin/activate && pip install --upgrade distribute
	source $@/bin/activate && pip install -r requirements.txt

doc/html: venv
	export PYTHONPATH="" && \
	source venv/bin/activate && \
	sphinx-apidoc -o doc crisis && \
	sphinx-apidoc -o doc crisis_app && \
	sphinx-build doc $@

docs: doc/html
	source venv/bin/activate && cd doc/html && python -m SimpleHTTPServer

clean-docs:
	rm -rf doc/html doc/crisis*rst

verify: WCDB3.zip
	mkdir ../cs373-wcdb-verify && \
	cp $< ../cs373-wcdb-verify/ && \
	cd ../cs373-wcdb-verify && \
	unzip $< && \
	make test-app

clean: clean-docs clear-cache
	rm -f TestWCDB*.out WCDB*.xml WCDB*.xsd.xml WCDB*.zip

.PHONY: zip turnin-list turnin-submit turnin-verify clean-docs clean
