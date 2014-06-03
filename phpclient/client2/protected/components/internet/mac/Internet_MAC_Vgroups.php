<?php

class Internet_MAC_Vgroups extends Vgroups_Grid {
    public function show($row) {
        $param = 'radius-insert-mac-staff';
        return $row->vgroup->$param;
    }
}

?>
