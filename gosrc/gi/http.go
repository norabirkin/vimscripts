package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

const TYPE_URLENCODED = 0
const TYPE_JSON = 1

type Http struct {
	url          string
	header       map[string]string
	format       int
	cookies      map[string]*http.Cookie
	beforeDecode func(body []byte) []byte
}

func (me *Http) get(url string, params map[string]interface{}) *HttpRequest {
	return &HttpRequest{
		url:    url,
		http:   me,
		method: "GET",
		params: params,
	}
}

func (me *Http) post(url string, params map[string]interface{}) *HttpRequest {
	return &HttpRequest{
		url:    url,
		http:   me,
		method: "POST",
		params: params,
	}
}

func (me *Http) put(url string, params map[string]interface{}) *HttpRequest {
	return &HttpRequest{
		url:    url,
		http:   me,
		method: "PUT",
		params: params,
	}
}

type HttpRequest struct {
	http   *Http
	url    string
	method string
	params map[string]interface{}
}

func (me *HttpRequest) json(js interface{}) error {
	var err error
	var result []byte

	if result, err = me.run(); err == nil && len(result) > 0 {
		if me.http.beforeDecode != nil {
			result = me.http.beforeDecode(result)
		}

		if err = json.Unmarshal(result, js); err != nil {
			log.Printf("Cannot decode reader %s", err)
		}
	}

	return err
}

func (me *HttpRequest) str() string {
	var result []byte
	var err error

	if result, err = me.run(); err != nil {
		return ""
	}

	return string(result)
}

func (me *HttpRequest) query(query url.Values) string {
	if me.params != nil {
		for k, v := range me.params {
			switch v.(type) {
			case string:
				query.Add(k, v.(string))
			case []string:
				for k1, v1 := range me.params {
					query.Add(k1, v1.(string))
				}
			default:
				log.Printf("Param %s must be string", k)
			}
		}
	}

	return query.Encode()
}

func (me *HttpRequest) log(category string, dump []byte) {
	if !app.Conf.OutputHttp && !app.Conf.LogHttp {
		return
	}

	str := fmt.Sprintf(
		"[%s]\n\n%s\n\n",
		category,
		strings.Trim(string(dump), "\r\n "),
	)

	if app.Conf.OutputHttp {
		fmt.Print(str)
	}
	if app.Conf.LogHttp {
		log.Print(str)
	}
}

func (me *HttpRequest) run() ([]byte, error) {
	var body io.Reader
	var contentType string
	var params string

	u, err := url.Parse(me.http.url + me.url)

	if err != nil {
		log.Printf("Cannot parse url: %s", err)
		return nil, err
	}

	if me.method == "GET" {
		u.RawQuery = me.query(u.Query())
	} else {
		if me.http.format == TYPE_URLENCODED {
			contentType = "application/x-www-form-urlencoded"
			params = me.query(url.Values{})

		} else if me.http.format == TYPE_JSON {
			contentType = "application/json"

			b, err := json.Marshal(me.params)

			if err != nil {
				log.Printf("Cannot encode params %s", err)
			} else {
				params = string(b)
			}
		} else {
			log.Printf("Invalid format %v", me.http.format)
		}

		body = strings.NewReader(params)
	}

	req, err := http.NewRequest(me.method, u.String(), body)

	for _, v := range me.http.cookies {
		req.AddCookie(v)
	}

	if me.method != "GET" {
		if contentType != "" {
			req.Header.Set("Content-Type", contentType)
		}
	}

	if err != nil {
		log.Printf("Failed to create request: %s", err)
		return nil, err
	}

	for k, v := range me.http.header {
		req.Header.Add(k, v)
	}

	dump, err := httputil.DumpRequestOut(req, true)

	if err != nil {
		log.Printf("Failed to dump request %s", err)
	} else {
		me.log("REQUEST", dump)
	}

	resp, err := app.client.Do(req)

	if err != nil {
		log.Printf("Failed to do request %s", err)
		return nil, err
	}

	dump, err = httputil.DumpResponse(resp, true)

	if err != nil {
		log.Printf("Failed to dump response %s", err)
	} else {
		me.log("RESPONSE", dump)
	}

	for _, v := range resp.Cookies() {
		me.http.cookies[v.Name] = v
	}

	result := app.read(resp.Body)

	return result, nil
}
