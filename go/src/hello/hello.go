package main

type hello struct {
	Controller
}

func (h hello) Get(id int) {
	h.Success(map[string]interface{}{
		"controller": "hello",
		"action":     "get",
		"id":         id,
	})
}

func (h hello) List() {
	h.Success(map[string]interface{}{
		"controller": "hello",
		"action":     "list",
	})
}

func (h hello) Delete(id int) {
	h.Success(map[string]interface{}{
		"controller": "hello",
		"action":     "delete",
		"id":         id,
	})
}

func (h hello) Create() {
	h.Success(map[string]interface{}{
		"controller": "hello",
		"action":     "create",
	})
}

func (h hello) Update(id int) {
	h.Success(map[string]interface{}{
		"controller": "hello",
		"action":     "update",
		"id":         id,
	})
}
