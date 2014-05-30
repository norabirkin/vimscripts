<?php

class Antivirus_Vgroups extends Vgroups_Grid {
    protected function show($row) {
        return count($this->helper()->categories($row->vgroup->vgid)) > 0;
    }
}

?>
