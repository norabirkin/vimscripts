<?php

class DTV_Equipment_BindedTo_Vgroup extends DTV_Equipment_BindedTo {
    public function output() {
        $html = '';
        foreach($this->helper()->eq()->vgroups() as $vgroup) {
            $html .= $this->table($vgroup)->render();
        }
        return $html;
    }
    public function columns() {
        $columns = parent::columns();
        unset($columns['action']);
        return $columns;
    }
    protected function title($data) {
        return $data->vgroup->login;
    }
}

?>
