package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"regexp"
)

func read(reader io.Reader) []byte {
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

func readFile(path string) string {
	var content []byte

	if file, err := os.Open(path); err == nil {
		content = read(file)
	} else {
		log.Printf("Cannot open file %s", err)
	}

	return string(content)
}

func open(path string, truncate bool) (*os.File, error) {
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

func write(path string, content string) error {
	var file *os.File
	var err error

	if file, err = open(path, true); err != nil {
		return err
	}

	if _, err = file.WriteString(content); err != nil {
		return err
	}

	return nil
}

var text string
var blocks []*Block

type Block struct {
	head     string
	content  string
	children []*Block
	parent   *Block
}

func (b *Block) text() string {
	result := b.head
	last := result[len([]byte(result))-1]

	for _, v := range b.children {
		result += v.content
	}

	if last == '(' {
		result += string(')')
	}
	if last == '{' {
		result += string('}')
	}

	return result
}

func (b *Block) add(block *Block) {
	b.children = append(b.children, block)
	blocks = append(blocks, block)

	block.parent = b
}

func main() {

	if len(os.Args) != 3 {
		log.Fatal("Invalid arguments")
	}

	php := readFile(os.Args[1])

	/*
		php = strings.Replace(php, "$", "", -1)
		php = strings.Replace(php, ";", "", -1)
		php = strings.Replace(php, "<?php", "", -1)
		php = strings.Replace(php, "?>", "", -1)
		php = strings.Replace(php, "'", "`", -1)
		php = strings.Replace(php, "class", "struct", -1)

		php = "package main" + php

		php = strings.Trim(php, "\n ")
	*/

	text = php

	current := &Block{}

	pattern := regexp.MustCompile(
		`(\bpublic|\bprotected|\bprivate)?\s+` +
			`function(\s+\w+)?\s*\(|` +
			`\w+\s*\(|` +
			`class(\s+\w+)\s*\{|` +
			`\{|` +
			`\}|` +
			`\(|` +
			`\)`,
	)

	for {
		idxs := pattern.FindStringIndex(php)
		length := len(idxs)

		if length == 0 {
			break
		}

		match := string(php[idxs[0]:idxs[1]])
		last := php[idxs[1]-1 : idxs[1]]

		current.add(&Block{
			content: string([]byte(php)[:idxs[0]]),
		})

		if last == "(" || last == "{" {
			block := &Block{
				head: match,
			}

			current.add(block)
			current = block
		} else if last == ")" || last == "}" {
			if current.parent != nil {
				current = current.parent
			} else {
				log.Fatal("Invalid block")
			}
		} else {
			log.Fatal("Invalid match")
		}

		php = string([]byte(php)[idxs[1]:])
	}

	result := ""

	for _, v := range blocks {
		if len(v.children) > 0 {
			fmt.Println(fmt.Sprintf("--START--\n\n%s\n\n--END--", v.text()))
		}
	}

	write(os.Args[2], result)
}
