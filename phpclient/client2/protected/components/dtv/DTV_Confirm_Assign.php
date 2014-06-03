<?php

class DTV_Confirm_Assign extends DTV_Confirm {
    protected function service() {
        $categories = $this->usbox(array(
            'vgid' => $this->param('vgid'),
            'unavail' => 0,
            'common' => $this->common()
        ))->categories();
        $categories = $this->multiple ? $categories->all(false) : $categories->idle();
        return $categories->get($this->param('catidx'));
    }
}

?>
