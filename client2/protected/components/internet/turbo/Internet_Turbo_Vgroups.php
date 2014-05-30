<?php

class Internet_Turbo_Vgroups extends Vgroups_Grid {
    public function output() {
        $turbo = new Internet_Turbo_Active;
        return parent::output() .
        $turbo->output();
    }
}

?>
