<?php

class DTV_Additional_Vgroups extends Vgroups_Grid {
    protected function show($row) {
        return $this->usbox(array(
            'vgid' => $row->vgroup->vgid,
            'dtvtype' => 3
        ))->categories()
          ->all(false)
          ->count();
    }
}

?>
