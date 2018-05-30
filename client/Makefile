BUILD_DIR=build
OUT_DIR=$(BUILD_DIR)/out
TMP_DIR=$(BUILD_DIR)/tmp

FACEBOOK_APP_SITE="http://play.thegatemud.it/webclient/"
FACEBOOK_CANVAS_SITE="https://apps.facebook.com/thegatemud/"

PRODUCTION_DIR="web/production/client/"
STAGING_DIR="web/staging/client/"
TESTTG_DIR="public_html/"

NPM_SYSTEM_DEPS="uglify-js"

ERB=erb -T -
UGLIFY=uglifyjs
UGLYOPTS=--wrap -m -c

.PHONY: clean debug install-deps npm-install-deps pack push release stage



ifeq ($(FACEBOOK_APP_ID),)
$(error FACEBOOK_APP_ID environment variable not defined)
endif

ifeq ($(FACEBOOK_CANVAS_ID),)
$(error FACEBOOK_CANVAS_ID environment variable not defined)
endif

ifeq ($(FACEBOOK_APP_SITE),)
$(error FACEBOOK_APP_SITE environment variable not defined)
endif

ifeq ($(FACEBOOK_CANVAS_SITE),)
$(error FACEBOOK_CANVAS_SITE environment variable not defined)
endif


debug: UGLYOPTS:=-b
debug: $(OUT_DIR)

release: $(OUT_DIR)

pack: release
	tar -v -C $(OUT_DIR) -c -j -f tgclient.tar.bz2 .

push: clean release
	rsync -rcv $(OUT_DIR)/* thegate@tg:$(PRODUCTION_DIR)

testtg: clean release
	rsync -rcv $(OUT_DIR)/* webclient@testtg.cloudapp.net:$(TESTTG_DIR)

pushall: clean release
	rsync -rcv $(OUT_DIR)/* thegate@tg:$(PRODUCTION_DIR)
	rsync -rcv $(OUT_DIR)/* webclient@testtg.cloudapp.net:$(TESTTG_DIR)

stage: clean debug
	rsync -rcv $(OUT_DIR)/* thegate@tg:$(STAGING_DIR)

clean:
	$(RM) -r $(BUILD_DIR)
	$(RM) assets_list

install-deps: npm-install-deps

npm-install-deps:
	sudo npm -g install $(NPM_SYSTEM_DEPS)


$(OUT_DIR): \
				$(OUT_DIR)/data/ethnicity/data.json \
				$(OUT_DIR)/data \
				$(OUT_DIR)/js/thegateway-client.js \
				$(OUT_DIR)/js/vendor \
				$(OUT_DIR)/stylesheets/thegateway.css \
				$(OUT_DIR)/stylesheets/vendor \
				$(OUT_DIR)/assets/fonts \
				$(OUT_DIR)/assets/icons \
				$(OUT_DIR)/assets/sounds \
				$(OUT_DIR)/index.html \
				$(OUT_DIR)/canvas.html


$(OUT_DIR)/index.html: index.html $(OUT_DIR)/js/thegateway-client.js $(OUT_DIR)/stylesheets/thegateway.css
	APP_ID=$(FACEBOOK_APP_ID) SITE_URL=$(FACEBOOK_APP_SITE) $(ERB) index.html > $@

$(OUT_DIR)/canvas.html: index.html $(OUT_DIR)/js/thegateway-client.js $(OUT_DIR)/stylesheets/thegateway.css
	APP_ID=$(FACEBOOK_CANVAS_ID) SITE_URL=$(FACEBOOK_CANVAS_SITE) $(ERB) index.html > $@

$(OUT_DIR)/js/thegateway-client.js: \
		js/thegateway-client.js \
		$(OUT_DIR)/data \
		$(OUT_DIR)/data/races/data.json \
		$(OUT_DIR)/data/ethnicity/data.json \
		$(OUT_DIR)/data/religions/data.json \
		$(OUT_DIR)/data/cultures/data.json \
		$(OUT_DIR)/data/locations/data.json \
		assets_list
	mkdir -p $(shell dirname $@)
	TEMP="$(shell mktemp)" ; $(ERB) js/thegateway-client.js | $(UGLIFY) $(UGLYOPTS) > $$TEMP ; cat js/copyright.js $$TEMP > $@ ; rm $$TEMP


$(OUT_DIR)/stylesheets/thegateway.css assets_list: sass/thegateway.scss sass/lib/output-styles.scss sass/lib/widgets.scss
	mkdir -p $(shell dirname $(OUT_DIR)/stylesheets/thegateway.css)
	$(RM) assets_list
	compass compile sass/thegateway.scss
	mv stylesheets/thegateway.css $(OUT_DIR)/stylesheets/thegateway.css

$(OUT_DIR)/js/vendor:
	mkdir -p $(shell dirname $@)
	cp -r js/vendor $(OUT_DIR)/js/vendor

$(OUT_DIR)/stylesheets/vendor:
	mkdir -p $(shell dirname $@)
	cp -r stylesheets/vendor $(OUT_DIR)/stylesheets/vendor

$(OUT_DIR)/assets/fonts:
	mkdir -p $(shell dirname $@)
	cp -r assets/fonts $@

$(OUT_DIR)/data:
	mkdir -p $(shell dirname $@)
	find ./data -name "*.html" -print0 | xargs -0 -n 1 -I file bash -c 'mkdir -p $(OUT_DIR)/`dirname file` ; cp file $(OUT_DIR)/file'

$(OUT_DIR)/data/races/data.json: $(OUT_DIR)/data
	mkdir -p $(shell dirname $@)
	$(ERB) data/races/data.json > $@

$(OUT_DIR)/data/ethnicity/data.json: $(OUT_DIR)/data
	mkdir -p $(shell dirname $@)
	$(ERB) data/ethnicity/data.json > $@

$(OUT_DIR)/data/religions/data.json: $(OUT_DIR)/data
	mkdir -p $(shell dirname $@)
	$(ERB) data/religions/data.json > $@

$(OUT_DIR)/data/cultures/data.json: $(OUT_DIR)/data
	mkdir -p $(shell dirname $@)
	$(ERB) data/cultures/data.json > $@

$(OUT_DIR)/data/locations/data.json: $(OUT_DIR)/data
	mkdir -p $(shell dirname $@)
	$(ERB) data/locations/data.json > $@

$(OUT_DIR)/assets/sounds:
	mkdir -p $(shell dirname $@)
	cp -r assets/sounds $@

$(OUT_DIR)/assets/icons:
	mkdir -p $(shell dirname $@)
	cp -r assets/icons $@
