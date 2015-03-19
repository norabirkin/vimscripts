package main

import (
	"errors"
	"log"
	"os"
	"runtime/debug"
)

type Conf struct {
	root             string
	Client           string             `json:"client"`
	Admin            string             `json:"admin"`
	LogFile          string             `json:"logFile"`
	RmKey            string             `json:"rmKey"`
	RmUrl            string             `json: "rmUrl"`
	RmLeader         int                `json "rmLeader"`
	SbssUrl          string             `json: "sbssUrl"`
	SbssLogin        string             `json: "sbssLogin"`
	SbssPassword     string             `json: "sbssPassword"`
	LogHttp          bool               `json: "logHttp"`
	OutputHttp       bool               `json: "outputHttp"`
	GitLabKey        string             `json: "gitLabKey"`
	GitLabUrl        string             `json: "gitLabUrl"`
	GitLabLeaderId   int                `json: "gitLabLeaderId"`
	Projects         map[string]Project `json: "projects"`
	projectConf      Project
	projectConfIsSet bool
}

type ConfBranch struct {
	Host   string `json: "host"`
	Branch string `json: "branch"`
}

type Project struct {
	IsLbcore      bool                  `json: "isLbcore"`
	GitLabProject int                   `json: "gitLabProject"`
	Branches      map[string]ConfBranch `json: "branches"`
	Supported     []string              `json: "supported"`
	Develop       string                `json: "develop"`
}

func (me *Conf) init() {
	app.decode(os.ExpandEnv("$HOME/ggi.json"), me)

	if file, err := app.open(app.Conf.getLogFile(), false); err == nil {
		log.SetOutput(file)
	}

	me.root = app.git.root()

	if me.root == "" {
		log.Fatal("Executed not inside git repository")
	}

	conf, exists := me.Projects[me.root]

	me.projectConf = conf
	me.projectConfIsSet = exists
}

func (me *Conf) getLogFile() string {
	if me.LogFile == "" {
		return os.ExpandEnv("$HOME/ggi.log")
	} else {
		return me.LogFile
	}
}

func (me *Conf) getRoot() string {
	if me.root == "" {
		log.Fatal("Root is not specified")
	}

	return me.root
}

func (me *Conf) getAdmin() string {
	admin := me.Admin

	if admin == "" {
		admin = "/phpclient/admin"
	}

	return me.getRoot() + admin
}

func (me *Conf) getClient() string {
	client := me.Client

	if client == "" {
		client = "/phpclient/client2/client"
	}

	return me.getRoot() + client
}

func (me *Conf) getRmKey() string {
	if me.RmKey == "" {
		log.Fatal("RM Key is not specified")
	}

	return me.RmKey
}

func (me *Conf) getRmUrl() string {
	if me.RmUrl == "" {
		me.RmUrl = "https://rm.lanbilling.ru"
	}

	return me.RmUrl
}

func (me *Conf) getSbssUrl() string {
	if me.SbssUrl == "" {
		me.SbssUrl = "https://hd.lanbilling.ru/index.php?async=1"
	}

	return me.SbssUrl
}

func (me *Conf) getSbssPassword() string {
	if me.SbssPassword == "" {
		log.Fatal("Sbss password is not specified")
	}

	return me.SbssPassword
}

func (me *Conf) getSbssLogin() string {
	if me.SbssLogin == "" {
		log.Fatal("Sbss login is not specified")
	}

	return me.SbssLogin
}

func (me *Conf) getBranch(alias string) (string, error) {
	if !me.projectConfIsSet {
		return "", errors.New("Project configuration is not specified")
	}

	if branch, exists := me.projectConf.Branches[alias]; exists {
		return branch.Branch, nil
	}

	return "", errors.New("Invalid branch alias")
}

func (me *Conf) getBranches() (map[string]ConfBranch, error) {
	if len(me.getProjectConf().Branches) > 0 {
		return me.getProjectConf().Branches, nil
	}

	return nil, errors.New("No branches specified")
}

func (me *Conf) getHost(alias string) (string, error) {
	if branch, exists := me.getProjectConf().Branches[alias]; exists {
		return branch.Host, nil
	}

	return "", errors.New("Invalid branch alias")
}

func (me *Conf) getGitLabKey() string {
	if me.GitLabKey == "" {
		log.Fatal("GitLab Key is not specified")
	}

	return me.GitLabKey
}

func (me *Conf) getGitLabUrl() string {
	if me.GitLabUrl == "" {
		me.GitLabUrl = "https://git.lanbilling.ru/api/v3"
	}

	return me.GitLabUrl
}

func (me *Conf) getGitLabProject() int {
	if me.getProjectConf().GitLabProject == 0 {
		log.Fatal("GitLab project ID is not specified")
	}

	return me.getProjectConf().GitLabProject
}

func (me *Conf) getGitLabLeaderId() int {
	if me.GitLabLeaderId == 0 {
		log.Fatal("GitLab leader ID is not specified")
	}

	return me.GitLabLeaderId
}

func (me *Conf) getRmLeader() int {
	if me.RmLeader == 0 {
		log.Fatal("Redmine leader ID is not specified")
	}

	return me.RmLeader
}

func (me *Conf) getSupported() []string {
	if len(me.getProjectConf().Supported) == 0 {
		log.Fatal("Supported branches are not specified")
	}

	return me.getProjectConf().Supported
}

func (me *Conf) getDevelop() string {
	if me.getProjectConf().Develop == "" {
		log.Fatal("Develop branch is not specified")
	}

	return me.getProjectConf().Develop
}

func (me *Conf) getIsLbcore() bool {
	return me.getProjectConf().IsLbcore
}

func (me *Conf) getProjectConf() Project {
	if !me.projectConfIsSet {
		log.Print(string(debug.Stack()))
		log.Fatal("Project configuration is not specified")
	}

	return me.projectConf
}

var conf Conf
