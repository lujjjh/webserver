TARGETS = dist/server dist/ui

.PHONY: all clean build _

all: clean build

clean:
	rm -rf dist

build: $(TARGETS)

dist/%: packages/% _
	@rm -rf $@
	@mkdir -p $@
	cd $< && npm install && npm run build
	cp -r $</dist/* $@
