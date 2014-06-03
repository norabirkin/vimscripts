<?php

class Sbss_Action extends LBWizardAction {
    public function __getWizard() {
        $wizard = new LBWizard(array(
            'steps' => array(
                new Sbss_Grid
            ),
            'final' => new Sbss_Save,
            'helper' => new Sbss_Helper
        ));
        if ($wizard->param('id')) {
            $wizard->add(new Sbss_Posts);
        } else {
            $wizard->add(new Sbss_Add);
        }
        return $wizard;
    }
}

?>
