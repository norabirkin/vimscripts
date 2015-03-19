package main

import (
	"os"
)

type Conf struct {
	Root    string `json:"root"`
	LogFile string `json:"logFile"`
}

func (me *Conf) getLogFile() string {
	if me.LogFile == "" {
		return os.ExpandEnv("$HOME/jgit.log")
	} else {
		return me.LogFile
	}
}

var conf Conf
