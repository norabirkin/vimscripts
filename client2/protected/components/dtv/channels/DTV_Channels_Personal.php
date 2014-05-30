<?php

class DTV_Channels_Personal extends DTV_Channels_Personal_Grids {
    private $fnext;
    private $group = array();
    public function row($row) {
        $processed = parent::row($row);
        $processed['action'] = $row->error ? LB_Style::warning($row->error) : $this->action($row);
        return $processed;
    }
    public function columns() {
        $columns = parent::columns();
        $columns['action'] = '';
        return $columns;
    }
    private function action($row) {
        if ($row->state == 'idle') {
            $id = $row->catidx;
            $name = 'catidx';
            $state = false;
        } else {
            $id = $row->service->servid;
            $name = 'servid';
            $state = true;
        }
        $field = $this->fnext()->wrap(array(
            'type' => 'checkbox',
            'skip' => true,
            'name' => $id,
            'value' => $state
        ));
        $field->setParent($this->group($name));
        return $this->fnext()->renderItem($field);
    }
    public function output() {
        $this->fnext()->add(array(
            'type' => 'custom',
            'value' => $this->grid(array(
                'title' => $this->title(),
                'columns' => $this->columns(),
                'data' => $this->helper()->personal(),
                'processor' => array($this, 'row')
            ))->render()
        ));
        $this->fnext()->add(
            array(
                'type' => 'submit',
                'value' => 'Apply'
            )
        );
        return $this->fnext()->render();
    }
    private function group($name) {
        if (!isset($this->group[$name])) {
            $this->group[$name] = $this->fnext()->add(array(
                'type' => 'array',
                'name' => $name
            ));
        }
        return $this->group[$name];
    }
    public function fnext($conf = array()) {
        if (!$this->fnext) {
            $this->fnext = parent::fnext($conf);
        }
        return $this->fnext;
    }
    public function title() {
        return 'Personal TV';
    }
}

?>
