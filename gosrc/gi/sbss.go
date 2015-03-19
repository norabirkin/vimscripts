package main

import (
	"crypto/md5"
	"crypto/sha1"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
)

type Sbss struct {
	http Http
}

func (me *Sbss) init() {
	me.http = Http{
		url:     app.Conf.getSbssUrl(),
		cookies: map[string]*http.Cookie{},
		beforeDecode: func(body []byte) []byte {
			result := strings.Trim(string(body), "\n ()")

			if result == "{ success: true }" {
				result = `{"success":true}`
			}

			return []byte(result)
		},
	}
}

type SbssResponse struct {
	Success bool   `json: "success"`
	Error   string `json: "error"`
}

func (me *SbssResponse) err() error {
	if !me.Success {
		msg := "Unknown error"

		if me.Error != "" {
			msg = me.Error
		}

		msg = fmt.Sprintf("Error: %s", msg)

		log.Print(msg)
		return errors.New(msg)
	}

	return nil
}

type SbssChallenge struct {
	SbssResponse
	Challenge int `json: "challenge"`
}

type SbssRequest struct {
	SbssResponse
	RequestHeader string `json: "requestheader"`
}

func (me *Sbss) authorize() error {
	var challenge SbssChallenge
	var response SbssResponse
	var err error

	err = me.http.post("", nil).json(&challenge)

	if err == nil {
		if challenge.err() != nil {
			err = me.http.post("", map[string]interface{}{
				"login":    app.Conf.getSbssLogin(),
				"remember": "0",
				"authorize": fmt.Sprintf("%x", sha1.Sum([]byte(
					app.Conf.getSbssLogin()+
						fmt.Sprintf(
							"%x",
							md5.Sum([]byte(app.Conf.getSbssPassword())),
						)+
						strconv.Itoa(challenge.Challenge),
				))),
			}).json(&response)

			if err == nil && response.err() != nil {
				err = errors.New("Unauthorized")
			}
		}
	}

	return err
}

func (me *Sbss) request(id int) *SbssRequest {
	var request SbssRequest

	if err := me.authorize(); err == nil {
		me.http.post("", map[string]interface{}{
			"inc":       "posts",
			"cmd":       "get",
			"requestid": strconv.Itoa(id),
		}).json(&request)

		request.err()
	}

	return &request
}
