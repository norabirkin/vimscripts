package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func main() {
	initConfig()
	initLog()
	initServer()
}

func initConfig() {
	if file, err := os.Open(os.ExpandEnv("$HOME/jgit.json")); err == nil {
		if err := json.NewDecoder(file).Decode(&app.Conf); err != nil {
			log.Fatal("Failed to decode config")
		}
	}
}

func initLog() {
	if file, err := os.OpenFile(
		app.Conf.getLogFile(),
		os.O_WRONLY|
			os.O_APPEND|
			os.O_CREATE,
		0666,
	); err == nil {
		log.SetOutput(file)
	} else {
		log.Fatal("Failed to open log file", err)
	}
}

func initServer() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		app.Processor = Processor{
			request: r,
			writer:  w,
		}
		app.Processor.run()
	})
	if err := http.ListenAndServe(":9001", nil); err != nil {
		log.Fatal("Failed to start server", err)
	}
}
