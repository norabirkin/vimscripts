package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strings"
)

type Processor struct {
	writer  http.ResponseWriter
	request *http.Request
	rest    Rest
}

type Rest struct {
	is     bool
	object string
	id     int
}

func (me *Processor) success(result interface{}) {
	json.NewEncoder(me.writer).Encode(map[string]interface{}{
		"success": true,
		"result":  result,
	})
}

func (me *Processor) error(error string) {
	json.NewEncoder(me.writer).Encode(map[string]interface{}{
		"success": false,
		"error":   error,
	})
}

func (me *Processor) parse() {
	if err := me.request.ParseForm(); err != nil {
		log.Fatal("Cannot parse request", err)
	}

	number := regexp.MustCompile(`^\d+$`)
	word := regexp.MustCompile(`^\w+$`)

	for _, segment := range strings.Split(me.request.URL.Path, "/") {
		if segment != "" {
		}
	}

	/*
		if len(matches) > 1 {
			me.rest.is = true
			me.rest.object = matches[1]
			if len(matches) > 3 {
				me.rest.id, _ = strconv.Atoi(matches[3])
			}
		}
	*/
}

func (me *Processor) run() {
	me.parse()

	if me.rest.is {
		me.success("It is REST")
	} else {
		me.success("Successfully connected to JGit")
	}
}
