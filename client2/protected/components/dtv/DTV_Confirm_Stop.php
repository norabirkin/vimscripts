<?php

class DTV_Confirm_Stop extends DTV_Confirm {
    public function title() {
        return $this->pageTitle;
    }
    protected function service() {
        return $this->usbox(array(
            'vgid' => $this->param('vgid'),
            'unavail' => 0,
            'common' => $this->common()
        ))
        ->active()
        ->get($this->param('servid'));
    }
}

?>
