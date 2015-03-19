package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

type App struct {
	Conf    Conf
	redmine Redmine
	client  *http.Client
	sbss    Sbss
	git     Git
	gitLab  GitLab
}

func (me *App) init() {
	me.Conf.init()

	me.client = &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
	}

	me.redmine.init()
	me.sbss.init()
	me.gitLab.init()
}

func (me *App) run() {
	action := me.ps(1)

	if _, err := me.Conf.getBranch(action); err == nil {
		me.git.checkouta(action)
	} else if strings.HasPrefix(action, "rm") {
		me.git.rm(action, me.ps(2))
	} else if strings.HasPrefix(action, "hd") {
		me.git.hd(action, me.ps(2))
	} else {
		switch action {

		case "conf":
			me.edit(os.ExpandEnv("$HOME/ggi.json"))
		case "s":
			me.git.status()
		case "u":
			path := os.ExpandEnv("$HOME/.GGI_RM_NOTE")
			me.edit(path)
			note := me.readFile(path)

			if err := os.Remove(path); err != nil {
				log.Printf("Cannot remove file %s", err)
			}

			if note == "" {
				log.Print("Note is empty")
				return
			}

			me.redmine.note(me.pi(2), note)
		case "p":
			me.git.pick(me.ps(2), me.git.hash(1))
		case "v":
			me.git.version(me.ps(2))
		case "b":
			me.git.version("")
		case "d":
			me.git.remove(me.ps(2))
		case "m":
			me.git.merge(me.ps(2))
		case "pm":
			me.git.pickAndMerge()
		case "pmb":
			me.git.pickAndMergeBase()
		case "c":
			me.commit()
		case "co":
			me.commit()
			me.git.post(me.git.last(1), nil, me.pi(2))
			me.redmine.test(me.pi(2))
			app.exec(exec.Command("git", "push"))
		case "l":
			me.git.post(me.git.last(1), nil, me.pi(2))
		case "lt":
			me.git.post(me.git.last(1), nil, me.pi(2))
			me.redmine.test(me.pi(2))
		case "prepmsg":
			me.git.prepmsg(me.ps(2))
		case "t":
			me.redmine.test(me.git.rmid(me.git.current()))
		case "pr":
			projects := me.gitLab.projects()

			for _, project := range *projects {
				fmt.Println(fmt.Sprintf(
					"%d %s",
					project.Id,
					project.Path_with_namespace,
				))
			}
		case "myid":
			fmt.Println(fmt.Sprintf("My Redmine ID is: %d", me.redmine.myid()))
		}
	}
}

func (me *App) commit() {
	var err error

	path := os.ExpandEnv("$HOME/.GI_RMID")
	err = me.write(path, me.ps(2))

	if err != nil {
		log.Fatal("Cannot write temporary file")
	}

	err = me.execs(exec.Command("git", "commit", "-a"))

	if err != nil {
		log.Fatal(fmt.Sprintf("Cannot commit: %s", err))
	}

	me.exec(exec.Command("rm", path))
}

func (me *App) ps(i int) string {
	if len(os.Args) <= i {
		log.Fatal("Invalid arguments")
	}

	return os.Args[i]
}

func (me *App) pi(i int) int {
	p := me.ps(i)

	intp, err := strconv.Atoi(p)

	if err != nil {
		log.Fatal("Failed to convert to int", err)
	}

	return intp
}

func (me *App) execCmd(cmd *exec.Cmd) (string, error) {
	out, err := cmd.CombinedOutput()

	args := strings.Join(cmd.Args, " ")

	output := strings.Trim(string(out), "\n ")

	if output != "" {
		output = fmt.Sprintf("\n\n%s", output)
	}

	str := fmt.Sprintf(
		"$ %v%s\n\n",
		args,
		output,
	)

	fmt.Print(str)
	log.Print(str)

	if err != nil {
		log.Printf("Command %s returned error: %s", args, err)
	}

	return string(out), err
}

func (me *App) exec(cmd *exec.Cmd) string {
	result, err := me.execCmd(cmd)

	if err != nil {
		log.Fatal("Command execution failed")
	}

	return result
}

func (me *App) read(reader io.Reader) []byte {
	var content []byte
	var err error

	if reader != nil {
		content, err = ioutil.ReadAll(reader)

		if err != nil {
			log.Printf("Failed to get response body %s", err)
		}

	}

	return content
}

func (me *App) readFile(path string) string {
	var content []byte

	if file, err := os.Open(path); err == nil {
		content = me.read(file)
	} else {
		log.Printf("Cannot open file %s", err)
	}

	return string(content)
}

func (me *App) decode(path string, val interface{}) {
	if file, err := os.Open(path); err == nil {
		if err := json.NewDecoder(file).Decode(val); err != nil {
			log.Fatal("Cannot decode file ", err)
		}
	} else {
		log.Fatal("Cannot open file ", err)
	}
}

func (me *App) execs(cmd *exec.Cmd) error {
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	return cmd.Run()
}

func (me *App) edit(path string) {
	err := me.execs(exec.Command(os.ExpandEnv("$EDITOR"), path))

	if err != nil {
		log.Printf("Cannot run editor %s", err)
	}
}

func (me *App) open(path string, truncate bool) (*os.File, error) {
	var i int

	if truncate {
		i = os.O_TRUNC
	} else {
		i = os.O_APPEND
	}

	if file, err :=

		os.OpenFile(
			path,
			os.O_WRONLY|i|os.O_CREATE,
			0666,
		); err == nil {

		return file, nil
	} else {
		log.Printf("Cannot open file %s", err)

		return nil, err
	}
}

func (me *App) write(path string, content string) error {
	var file *os.File
	var err error

	if file, err = me.open(path, true); err != nil {
		return err
	}

	if _, err = file.WriteString(content); err != nil {
		return err
	}

	return nil
}

var app App
