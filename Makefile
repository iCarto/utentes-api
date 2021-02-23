current-dir := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

.SILENT:

.PHONY: help
help: ## Shows the list of targets that has a comment
	awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf " \033[36m%-20s\033[0m  %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: test
test: ## Launchs all the test and deprecation warnings
	python -Wd -m unittest discover -s utentes.tests
