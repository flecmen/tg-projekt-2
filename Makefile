JS_FILES = $(wildcard src/*.js)

OUT_FILES = $(patsubst src/%.js,%,$(JS_FILES))

NODE = node

all: $(OUT_FILES)

$(OUT_FILES): % : src/%.js
	cp $< $@
	chmod +x $@

.PHONY: clean

clean:
	rm -f $(OUT_FILES)