<?php

class Other_Assign_Nonrecurrent extends DTV_Additional_Assign {
    public function execute() {
        return $this->usbox()->schedule(array(
            'vgid' => $this->param('vgid'),
            'timefrom' => $this->param('date'),
            'catidx' => $this->param('catidx')
        ));
    }
}

?>
