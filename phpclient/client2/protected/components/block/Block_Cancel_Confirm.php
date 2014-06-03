<?php

class Block_Cancel_Confirm extends Block_Confirm {
    protected $submit = 'Cancel';
    protected function blockDate() {
        return $this->vgroup()->blockrasp->changetime;
    }
    public function title() {
        return $this->helper()->cancelChangeStateText($this->vgroup());
    }
}

?>
