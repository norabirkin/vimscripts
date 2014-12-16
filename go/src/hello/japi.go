package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
)

type japiResult struct {
	result  interface{}
	err     string
	isError bool
}

func (j *japiResult) Init(data map[string]interface{}) {
	if r, e := data["result"]; e {
		j.result = r
	} else {
		j.isError = true
		if _, e := data["error"]; e {
			if v, e := data["error"].(map[string]interface{})["message"]; e {
				j.err = v.(string)
			}
		}
		if j.err == "" {
			j.err = "Unknown error"
		}
	}
}

func (j *japiResult) Result() interface{} {
	return j.result
}

func (j *japiResult) Error() string {
	return j.err
}

func (j *japiResult) IsError() bool {
	return j.isError
}

type japiCall struct {
	Id     int                    `json:"id"`
	Method string                 `json:"method"`
	Params map[string]interface{} `json:"params"`
}

type japi struct {
	id       int
	request  []japiCall
	response []*japiResult
}

func (j *japi) Call(m string, p map[string]interface{}) *japiResult {
	r := japiResult{}
	j.response = append(j.response, &r)
	j.id++
	j.request = append(j.request, japiCall{j.id, m, p})
	return &r
}

func (j *japi) Send() {
	var s string
	var v []byte
	var e error

	for _, i := range j.request {
		if v, e = json.Marshal(i); e != nil {
			fmt.Printf("Error json: %s", e)
		}
		s = s + string(v) + "\n"
	}

	if c, e := net.Dial("tcp", "192.168.30.10:1502"); e == nil {
		fmt.Fprint(c, s)
		fmt.Println("REQUEST")
		fmt.Println(s)
		fmt.Println("")
		fmt.Println("RESPONSE")
		for i := 0; i < j.id; i++ {
			l, e := bufio.NewReader(c).ReadString('\n')
			fmt.Println(l)
			if e != nil {
				fmt.Println(e)
			}
			d := map[string]interface{}{}
			json.Unmarshal([]byte(l), &d)
			j.response[i].Init(d)
		}
		fmt.Println("")
		c.Close()
		j.id = 0
		j.request = []japiCall{}
		j.response = []*japiResult{}
	} else {
		fmt.Printf("Error: %s", e)
	}
}

func (j *japi) CallAndSend(m string, p map[string]interface{}) interface{} {
	r := j.Call(m, p)
	j.Send()
	return r.Result()
}
