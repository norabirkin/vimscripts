package main

func getController(c string) IController {
	switch c {
	case "hello":
		return &hello{}
	case "bye":
		return &bye{}
	}
	return &hello{}
}
