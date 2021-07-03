INSTALL_PACKAGES = server ui

.PHONY: all clean install build _

all: clean install

clean:
	rm -rf dist

install: $(addprefix dist/,$(INSTALL_PACKAGES))

build:
	npm install
	$(MAKE) -C packages

dist/%: packages/% build _
	rm -rf $@
	mkdir -p $@
	cp -r $</dist/* $@
