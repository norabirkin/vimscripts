<?php

class DTV_Channels_Confirm_Stop extends DTV_Channels_Confirm {
    public function title() {
        return $this->stopTitle;
    }
    protected function service() {
        return $this->usbox(array(
            'vgid' => $this->param('vgid'),
            'unavail' => 0,
            'common' => 1
        ))
        ->active()
        ->get($this->param('servid'));
    }
}

?>
