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

.PHONY: doc

