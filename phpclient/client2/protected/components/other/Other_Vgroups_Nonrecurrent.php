<?php

class Other_Vgroups_Nonrecurrent extends Other_Vgroups {
    protected function action($service) {
        return $this->lnext('Order', array(
            'vgid' => $service->vgid
        ));
    }
    protected function columns() {
        $columns = parent::columns();
        unset($columns['timefrom']);
        unset($columns['timeto']);
        unset($columns['state']);
        return $columns;
    }
}

?>
