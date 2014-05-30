<?php

class Block_History_Action extends LBWizardAction {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Vgroups_Grid,
                new Block_History_Details
            )
        ));
    }
    public function tariffType() {
        return true;
    }
}

?>
