package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

type Git struct {
	branch string
}

func (me *Git) status() string {
	return app.exec(exec.Command("git", "status"))
}

func (me *Git) rmhd(branch string, alias string, format string) {
	var remote string
	var err error
	var id int

	b := []byte(branch)

	if len(b) <= 2 {
		log.Fatal("Invalid issue ID")
	}

	if id, err = strconv.Atoi(string(b[2:])); err != nil {
		log.Fatal("Invalid issue ID: ", err)
	}

	if remote, err = app.Conf.getBranch(alias); err != nil {
		log.Fatal(err)
	}

	me.checkoutb(fmt.Sprintf(format, id), remote)

	me.wsdl(alias)
}

func (me *Git) rm(branch string, alias string) {
	me.rmhd(branch, alias, "dev/rm%d")
}

func (me *Git) hd(branch string, alias string) {
	me.rmhd(branch, alias, "tt/%d")
}

func (me *Git) track() string {
	for _, v := range strings.Split(app.exec(
		exec.Command("git", "branch", "-vv"),
	), "\n") {
		if strings.HasPrefix(v, "*") {
			pattern := regexp.MustCompile(`\[origin/([^:\]]+).*\]`)
			matches := pattern.FindStringSubmatch(v)

			if len(matches) == 2 {
				return matches[1]
			}
		}
	}

	return ""
}

func (me *Git) pickAndMerge() {
	hash := me.hash(me.ahead())

	for _, v := range me.upper() {
		me.pick(v, hash)
		me.merge(v)
	}
}

func (me *Git) pickAndMergeBase() {
	var branch string

	ahead := me.ahead()

	hash := me.hash(ahead)
	branches := []string{}
	branchesShort := []string{}

	for _, v := range me.upper() {
		var (
			err error
		)

		branch, err = app.Conf.getBranch(v)

		if err == nil {
			branches = append(branches, "remotes/origin/"+branch)
			branchesShort = append(branchesShort, branch)
		}
	}

	app.exec(exec.Command("git", "fetch"))

	cmd := exec.Command("git", "merge-base")

	for _, v := range branches {
		cmd.Args = append(cmd.Args, v)
	}

	commit := strings.Trim(app.exec(cmd), "\n ")

	current := me.current()

	branch = me.base(me.current(), "base")

	useBase := true

	back := func() {
		app.exec(exec.Command(
			"git", "checkout", current,
		))

		me.branch = current

		app.exec(exec.Command("git", "branch", "-D", branch))
	}

	toBase := func() {
		app.exec(exec.Command(
			"git", "checkout", "-b", branch, commit,
		))

		me.branch = branch
	}

	for _, v := range branches {
		toBase()

		if err := me.cherryPick(hash); err != nil {
			useBase = false
			app.exec(exec.Command("git", "reset", "--hard", "HEAD"))

			back()

			break
		}

		_, err := app.execCmd(exec.Command("git", "rebase", v))

		if err != nil {
			useBase = false
			app.exec(exec.Command("git", "rebase", "--abort"))

			back()

			break
		}

		back()
	}

	if !useBase {
		me.pickAndMerge()
	} else {
		toBase()

		if err := me.cherryPick(hash); err != nil {
			log.Fatal(err)
		}

		for _, v := range branchesShort {
			me.mergeRequest(v, ahead)
		}
	}

}

func (me *Git) upper() []string {
	var alias string

	branch := me.track()

	branches, err := app.Conf.getBranches()

	if err != nil {
		log.Fatal(err)
	}

	for k, v := range branches {
		if v.Branch == branch {
			alias = k
			break
		}
	}

	if alias == "" {
		log.Fatal("Cannot find alias of tracked branch")
	}

	upper := []string{alias}

	if alias != app.Conf.getDevelop() {
		add := false

		for _, v := range app.Conf.getSupported() {
			if v == alias {
				add = true
			} else {
				if add {
					upper = append(upper, v)
				}
			}
		}

		upper = append(upper, app.Conf.getDevelop())
	}

	return upper
}

func (me *Git) pick(alias string, hash []string) {
	var err error

	remote, err := app.Conf.getBranch(alias)

	if err != nil {
		log.Fatal(err)
	}

	if me.track() == remote {
		msg := fmt.Sprintf("Current branch tracks %s", remote)
		log.Print(msg)
		fmt.Println(msg)

		return
	}

	branch := me.base(me.current(), alias)

	me.checkoutb(branch, remote)

	err = me.cherryPick(hash)

	if err != nil {
		log.Fatal(err)
	}
}

func (me *Git) cherryPick(hash []string) error {
	for i := (len(hash) - 1); i >= 0; i-- {
		_, err := app.execCmd(exec.Command("git", "cherry-pick", hash[i]))

		if err != nil {
			return err
		}
	}

	return nil
}

func (me *Git) merge(alias string) {
	var branch string

	remote, err := app.Conf.getBranch(alias)

	if err != nil {
		log.Fatal(err)
	}

	current := me.current()

	if remote == me.track() {
		branch = current
	} else {
		branch = me.base(current, alias)
		me.checkout(branch)
	}

	app.exec(exec.Command("git", "fetch"))
	app.exec(exec.Command("git", "rebase", "remotes/origin/"+remote))

	me.mergeRequest(remote, me.ahead())
}

func (me *Git) mergeRequest(remote string, ahead int) {
	branch := me.current()

	app.exec(exec.Command("git", "push", "--force", "origin", branch))

	commits := me.last(ahead)

	title, message := me.parse(commits)

	if ahead > 1 {
		path := os.ExpandEnv("$HOME/.GI_MERGE_REQUEST_MSG")

		err := app.write(path, message)

		if err != nil {
			log.Fatal("Cannot write temporary file")
		}

		app.edit(path)
		message = app.readFile(path)
	}

	project := app.gitLab.project(app.Conf.getGitLabProject())

	if project.Id == 0 {
		log.Fatal("Project not found")
	}

	merge := app.gitLab.merge(app.Conf.getGitLabProject(), map[string]interface{}{
		"assignee_id":   app.Conf.getGitLabLeaderId(),
		"source_branch": branch,
		"target_branch": remote,
		"title":         title,
		"description":   message,
	})

	if merge.Iid == 0 {
		log.Fatal("Cannot create merge request")
	}

	me.post(commits, func(message string) string {
		return fmt.Sprintf(
			"https://git.lanbilling.ru/%s/merge_requests/%d\n\n%s",
			project.Path_with_namespace,
			merge.Iid,
			message,
		)
	}, 0)
}

func (me *Git) post(
	commits string,
	callback func(message string) string,
	rmid int,
) {
	current := me.current()

	if rmid == 0 {
		rmid = me.rmid(current)
	}

	if rmid > 0 {
		message := fmt.Sprintf("<pre>BRANCH: %s\n\n%s</pre>", current, commits)

		if callback != nil {
			message = callback(message)
		}

		app.redmine.note(rmid, message)
	}
}

func (me *Git) prepmsg(path string) {
	var rmid int
	var err error
	var current string

	rmidFile := app.readFile(os.ExpandEnv("$HOME/.GI_RMID"))

	if len(rmidFile) > 0 {
		rmid, err = strconv.Atoi(rmidFile)

		if err != nil {
			log.Printf("Failed to convert to int %s", rmidFile)
		}
	}

	if rmid == 0 {
		current = me.current()
		rmid = me.rmid(current)
	}

	if rmid > 0 {
		issue := app.redmine.issue(rmid)
		me.message(path, fmt.Sprintf("RM#%d %s", rmid, issue.Issue.Subject))
	} else {
		hdid := me.hdid(current)

		if hdid > 0 {
			request := app.sbss.request(hdid)
			me.message(path, fmt.Sprintf("HD@%d %s", hdid, request.RequestHeader))
		}
	}
}

func (me *Git) root() string {
	return strings.Trim(app.exec(exec.Command(
		"git",
		"rev-parse",
		"--show-toplevel",
	)), "\n ")
}

func (me *Git) message(path string, title string) {
	path = me.root() + "/" + path
	message := app.readFile(path)

	if !strings.HasPrefix(message, title) {
		app.write(path, title+"\n"+message)
	}
}

func (me *Git) rmid(branch string) int {
	return me.id(branch, "dev/rm")
}

func (me *Git) hdid(branch string) int {
	return me.id(branch, "tt/")
}

func (me *Git) id(branch string, prefix string) int {
	splitted := strings.Split(branch, "-")
	branch = splitted[0]

	length := len([]byte(prefix))

	if strings.HasPrefix(branch, prefix) {
		id, err := strconv.Atoi(string([]byte(branch)[length:]))

		if err != nil {
			log.Fatal(fmt.Sprintf("Cannot convert to integer. Error: %s", err))
		}

		return id
	}

	return 0
}

func (me *Git) version(alias string) {
	me.checkout(me.base(me.current(), alias))
}

func (me *Git) remove(alias string) {
	current := me.current()

	me.checkouta(alias)

	app.exec(exec.Command("git", "branch", "-D", current))
}

func (me *Git) base(branch string, alias string) string {
	base := strings.Split(branch, "-")
	last := len(base) - 1

	if last > 0 {
		var cut bool

		if base[last] == "base" {
			cut = true
		}
		if _, err := app.Conf.getBranch(base[last]); err == nil {
			cut = true
		}
		if cut {
			base = base[0:last]
		}
	}

	if alias != "" {
		base = append(base, alias)
	}

	return strings.Join(base, "-")
}

func (me *Git) current() string {
	if me.branch == "" {
		pattern := regexp.MustCompile(`^# On branch (.*)\n`)
		matches := pattern.FindStringSubmatch(me.status())

		if len(matches) != 2 {
			log.Fatal("Invalid status")
		}

		me.branch = matches[1]
	}

	return me.branch
}

func (me *Git) last(limit int) string {
	return app.exec(exec.Command(
		"git",
		"log",
		fmt.Sprintf("--max-count=%d", limit),
	))
}

func (me *Git) hash(length int) []string {
	return strings.Split(app.exec(exec.Command(
		"git",
		"log",
		"--pretty=format:%h",
		"--max-count="+strconv.Itoa(length),
	)), "\n")
}

func (me *Git) wsdl(alias string) {
	var wsdl string

	if !app.Conf.getIsLbcore() {
		return
	}

	host, _ := app.Conf.getHost(alias)

	app.exec(exec.Command(
		"cp",
		app.Conf.getRoot()+"/xmlapi/api3.wsdl",
		app.Conf.getAdmin()+"/soap/",
	))

	path := app.Conf.getAdmin() + "/soap/api3.wsdl"

	if wsdl = app.readFile(path); wsdl == "" {
		log.Fatal("Cannot read WSDL")
	}

	err := app.write(path, strings.Replace(
		wsdl,
		"http://127.0.0.1:34012",
		fmt.Sprintf("http://%s:34012", host),
		-1,
	))

	if err != nil {
		log.Fatal("Cannot write WSDL")
	}

	app.exec(exec.Command(
		"cp",
		path,
		app.Conf.getClient()+"/soap/",
	))
}

func (me *Git) checkouta(alias string) {

	branch, err := app.Conf.getBranch(alias)

	if err != nil {
		log.Fatal(err)
	}

	app.exec(exec.Command("git", "checkout", branch))
	app.exec(exec.Command("git", "pull", "--rebase"))

	me.wsdl(alias)

	me.branch = branch
}

func (me *Git) checkoutb(branch string, remote string) {
	app.exec(exec.Command("git", "fetch"))

	remote = fmt.Sprintf("remotes/origin/%s", remote)

	result, err := app.execCmd(exec.Command(
		"git",
		"checkout",
		"-b",
		branch,
		remote,
	))

	if err != nil {
		if strings.Trim(result, "\n ") == fmt.Sprintf(
			"fatal: git checkout: branch %s already exists",
			branch,
		) {
			app.exec(exec.Command("git", "checkout", branch))
			app.exec(exec.Command("git", "rebase", remote))
		} else {
			log.Fatal(err)
		}
	}

	me.branch = branch
}

func (me *Git) test() {
	app.exec(exec.Command("git", "rebase", "b1"))
}

func (me *Git) checkout(branch string) {

	app.exec(exec.Command("git", "checkout", branch))
	app.exec(exec.Command("git", "pull", "--rebase"))

	me.branch = branch
}

func (me *Git) ahead() int {
	var err error
	limit := 1

	pattern := regexp.MustCompile(
		`# Your branch is ahead of 'origin\/[^']+' by ([0-9]+) commits\.`,
	)
	matches := pattern.FindStringSubmatch(me.status())

	if len(matches) == 2 {
		limit, err = strconv.Atoi(matches[1])

		if err != nil {
			log.Fatal(fmt.Sprintf(
				"Cannot convert %s to integer. Error: %s",
				matches[1],
				err,
			))
		}
	}

	return limit
}

func (me *Git) parse(log string) (string, string) {
	var title string
	var message string
	var first bool

	for _, v := range strings.Split(log, "\n") {
		if strings.HasPrefix(v, "commit ") {
			first = true
		} else if strings.HasPrefix(v, "    ") {
			v = strings.Trim(v, " ")

			if first {
				first = false
				title = v
			} else {
				message = message + "\n" + v
			}
		}
	}

	return title, strings.Trim(message, "\n ")
}
