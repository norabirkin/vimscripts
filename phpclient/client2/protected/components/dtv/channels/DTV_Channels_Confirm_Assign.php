<?php

class DTV_Channels_Confirm_Assign extends DTV_Channels_Confirm {
    public function title() {
        return 'Confirm assign service';
    }
    protected function service() {
        return $this->usbox(array(
            'vgid' => $this->param('vgid'),
            'unavail' => 0,
            'common' => 1
        ))
        ->categories()
        ->idle()
        ->get($this->param('catidx'));
    }
}

?>
