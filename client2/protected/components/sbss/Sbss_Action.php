<?php

class Sbss_Action extends LBWizardAction {
    public function __getWizard() {
        return new LBWizard(array(
            'steps' => array(
                new Sbss_Grid,
                new Sbss_Posts
            ),
            'helper' => new Sbss_Helper
        ));
    }
}

?>
