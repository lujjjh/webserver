PACKAGES = $(sort $(dir $(wildcard */)))

.PHONY: all build _

all: build

build: $(PACKAGES)

%/: % _
	cd $< && npm run build
