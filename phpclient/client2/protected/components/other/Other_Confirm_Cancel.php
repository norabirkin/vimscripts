<?php

class Other_Confirm_Cancel extends DTV_Confirm {
    protected function service() {
        return $this->usbox(array(
            'vgid' => $this->param('vgid'),
            'unavail' => 0,
            'common' => 1
        ))
        ->scheduled()
        ->get($this->param('servid'));
    }
}

?>
