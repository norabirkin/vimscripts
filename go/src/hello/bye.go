package main

type bye struct {
	Controller
}

func (b bye) Get(id int) {
	b.Success(map[string]interface{}{
		"controller": "bye",
		"action":     "get",
		"id":         id,
	})
}

func (b bye) List() {
	b.Success(map[string]interface{}{
		"controller": "bye",
		"action":     "list",
	})
}

func (b bye) Delete(id int) {
	b.Success(map[string]interface{}{
		"controller": "bye",
		"action":     "delete",
		"id":         id,
	})
}

func (b bye) Create() {
	b.Success(map[string]interface{}{
		"controller": "bye",
		"action":     "create",
	})
}

func (b bye) Update(id int) {
	var err string

	er := b.Japi.Call("WrongFunctionName", map[string]interface{}{
		"param1": "val1",
		"param2": "val2",
	})
	b.Japi.Send()
	if er.IsError() {
		err = er.Error()
	}
	b.Success(map[string]interface{}{
		"controller": "bye",
		"action":     "update",
		"id":         id,
		"param1":     b.ParB("param1"),
		"param2":     b.ParI("param2"),
		"param3":     b.ParF("param3"),
		"param4":     b.ParS("param4"),
		"param5":     b.ParS("param5"),
		"param6":     b.ParI("param6"),
		"param7":     b.ParF("param7"),
		"error":      err,
	})
}
