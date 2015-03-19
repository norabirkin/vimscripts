package main

import (
	"fmt"
	"net/http"
)

type GitLab struct {
	http Http
}

func (me *GitLab) init() {
	me.http = Http{
		url:     app.Conf.getGitLabUrl(),
		format:  TYPE_JSON,
		cookies: map[string]*http.Cookie{},
		header: map[string]string{
			"PRIVATE-TOKEN": app.Conf.getGitLabKey(),
		},
	}
}

func (me *GitLab) project(id int) *GitLabProject {
	var project GitLabProject

	me.http.get(fmt.Sprintf("/projects/%d", id), nil).json(&project)

	return &project
}

func (me *GitLab) projects() *[]GitLabProject {
	var projects []GitLabProject

	me.http.get("/projects", map[string]interface{}{
		"per_page": "100",
	}).json(&projects)

	return &projects
}

func (me *GitLab) merge(id int, params map[string]interface{}) *GitLabMerge {
	var merge GitLabMerge

	me.http.post(fmt.Sprintf(
		"/projects/%d/merge_requests", id,
	), params).json(&merge)

	return &merge
}

type GitLabMerge struct {
	Iid int `json: "iid"`
}

type GitLabProject struct {
	Id                  int    `json: "id"`
	Path_with_namespace string `json: "path_with_namespace"`
}
