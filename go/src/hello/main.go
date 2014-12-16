package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
)

type IController interface {
	Get(i int)
	List()
	Delete(i int)
	Create()
	Update(i int)
	Init(w http.ResponseWriter, b map[string]interface{}, q map[string][]string, r *http.Request)
}

type Controller struct {
	Writer  http.ResponseWriter
	Body    map[string]interface{}
	Query   map[string][]string
	Request *http.Request
}

func (c *Controller) Output(v interface{}) {
	if s, e := json.Marshal(v); e != nil {
		log.Fatal("Cannot encode value ", e)
	} else {
		fmt.Fprint(c.Writer, string(s))
	}
}

func (c *Controller) Success(v interface{}) {
	c.Output(map[string]interface{}{
		"success": true,
		"results": v,
	})
}

func (c *Controller) Error(v interface{}) {
	c.Output(map[string]interface{}{
		"success": false,
		"error":   v,
	})
}

func (c *Controller) Init(w http.ResponseWriter, b map[string]interface{}, q map[string][]string, r *http.Request) {
	c.Writer = w
	c.Body = b
	c.Query = q
	c.Request = r
}

func (c *Controller) ParSet(n string) bool {
	var f bool

	if _, f = c.Query[n]; f {
		return f
	}
	_, f = c.Body[n]
	return f
}

func (c *Controller) ParS(n string) string {
	var r string

	if q, f := c.Query[n]; f {
		r = q[0]
	} else if b, f := c.Body[n]; f {
		switch b.(type) {
		case string:
			r = b.(string)
		case float64:
			r = strconv.FormatFloat(b.(float64), 'f', -1, 64)
		case bool:
			r = strconv.FormatBool(b.(bool))
		}
	}
	return r
}

func (c *Controller) ParI(n string) int {
	var r int

	if q, f := c.Query[n]; f {
		r, _ = strconv.Atoi(q[0])
	} else if b, f := c.Body[n]; f {
		switch b.(type) {
		case float64:
			r = int(b.(float64))
		case bool:
			if b.(bool) {
				r = 1
			}
		case string:
			r, _ = strconv.Atoi(b.(string))
		}
	}
	return r
}

func (c *Controller) ParF(n string) float64 {
	var r float64

	if q, f := c.Query[n]; f {
		r, _ = strconv.ParseFloat(q[0], 64)
	} else if b, f := c.Body[n]; f {
		switch b.(type) {
		case float64:
			r = b.(float64)
		case string:
			r, _ = strconv.ParseFloat(b.(string), 64)
		case bool:
			if b.(bool) {
				r = 1.0
			}
		}
	}
	return r
}

func (c *Controller) ParB(n string) bool {
	var r bool

	if q, f := c.Query[n]; f {
		if q[0] == "" {
			r = false
		} else {
			r = true
		}
	} else if b, f := c.Body[n]; f {
		switch b.(type) {
		case float64:
			if b.(float64) == 0.0 {
				r = false
			} else {
				r = true
			}
		case string:
			if b.(string) == "" {
				r = false
			} else {
				r = true
			}
		case bool:
			r = b.(bool)
		}
	}
	return r
}

func main() {
	http.HandleFunc("/", process)
	if err := http.ListenAndServe(":9001", nil); err != nil {
		log.Fatal("failed to start server", err)
	}
}

func run(c IController, r *http.Request, i int) {
	if r.Method == "GET" {
		if i == 0 {
			c.List()
		} else {
			c.Get(i)
		}
	} else if r.Method == "POST" {
		c.Create()
	} else if r.Method == "PUT" {
		c.Update(i)
	} else if r.Method == "DELETE" {
		c.Delete(i)
	} else {
		c.List()
	}
}

func authorize() interface{} {
	j := japi{}
	r := j.CallAndSend("WebSessionHandler", map[string]interface{}{
		"event":      "open",
		"id":         "",
		"time_stamp": 0,
		"data":       "",
	})
	j.CallAndSend("WebSessionHandler", map[string]interface{}{
		"event":      "close",
		"id":         "",
		"time_stamp": 0,
		"data":       "",
	})
	return r
}

func process(w http.ResponseWriter, r *http.Request) {
	var c string
	var i int

	if e := r.ParseForm(); e != nil {
		fmt.Fprintf(w, "Error: %v", e)
	} else {
		p := regexp.MustCompile(`^/(\w+)(/(\d*))?$`)
		s := p.FindStringSubmatch(r.URL.Path)
		if len(s) > 1 {
			c = s[1]
			if len(s) > 3 {
				i, e = strconv.Atoi(s[3])
			}
		}
		t := getController(c)
		o := map[string]interface{}{}
		d := json.NewDecoder(r.Body)
		d.Decode(&o)
		m := r.Form
		t.Init(w, o, m, r)
		run(t, r, i)
	}
}
