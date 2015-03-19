package main

import (
	"fmt"
	"log"
	"net/http"
)

const STATUS_TEST = 4
const STATUS_NEW = 1
const STATUS_SOLUTION = 2

type Redmine struct {
	http Http
}

type IssueRoot struct {
	Issue Issue `json: "issue"`
}

type Issue struct {
	Subject string      `json: "subject"`
	Status  IssueStatus `json: "status"`
}

type IssueStatus struct {
	Id int `json: "id"`
}

func (me *Redmine) init() {
	me.http = Http{
		url:     app.Conf.getRmUrl(),
		format:  TYPE_JSON,
		cookies: map[string]*http.Cookie{},
		header: map[string]string{
			"X-Redmine-API-Key": app.Conf.getRmKey(),
		},
	}
}

func (me *Redmine) issue(id int) *IssueRoot {
	var issue IssueRoot

	me.http.get(fmt.Sprintf("/issues/%v.json", id), nil).json(&issue)

	return &issue
}

func (me *Redmine) note(id int, note string) {
	me.http.put(fmt.Sprintf("/issues/%v.json", id), map[string]interface{}{
		"issue": map[string]interface{}{
			"notes": note,
		},
	}).run()
}

type RmUserRoot struct {
	User RmUser `json: "user"`
}

type RmUser struct {
	Id int `json: "id"`
}

func (me *Redmine) myid() int {
	var user RmUserRoot

	me.http.get("/users/current.json", nil).json(&user)

	return user.User.Id
}

func (me *Redmine) test(id int) {
	if id == 0 {
		log.Print("RM Id is 0")
		return
	}

	issue := me.issue(id)

	if issue.Issue.Status.Id == STATUS_NEW {
		me.http.put(fmt.Sprintf("/issues/%d.json", id), map[string]interface{}{
			"issue": map[string]interface{}{
				"status_id": STATUS_SOLUTION,
			},
		}).run()
	}

	me.http.put(fmt.Sprintf("/issues/%d.json", id), map[string]interface{}{
		"issue": map[string]interface{}{
			"assigned_to_id": app.Conf.getRmLeader(),
			"status_id":      STATUS_TEST,
		},
	}).run()
}
