test: venv
	source venv/bin/activate && python manage.py test

test-app: venv
	source venv/bin/activate && python manage.py test crisis_app

clear-cache:
	rm crisis_app/cache/json
	rm crisis_app/cache/xml

run: venv
	source venv/bin/activate && python manage.py runserver

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

venv:
	virtualenv venv --distribute
	source venv/bin/activate && pip install -r requirements.txt

doc/html: venv
	source venv/bin/activate && \
	sphinx-apidoc -o doc crisis && \
	sphinx-apidoc -o doc crisis_app && \
	sphinx-build doc doc/html

docs: doc/html
	source venv/bin/activate && cd doc/html && python -m SimpleHTTPServer

clean-docs:
	rm -rf doc/html doc/crisis*rst


.PHONY: zip turnin-list turnin-submit turnin-verify clean-docs
