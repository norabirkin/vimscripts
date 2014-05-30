<?php

class Other_Action extends LBWizardAction {
    public function __getWizard() {
        $helper = new Other_Helper;
        $wizard = new LBWizard(array(
            'steps' => array(
                new Other_Services,
            ),
            'helper' => $helper
        ));
        if ($wizard->param('catidx') !== null) {
            if ($wizard->param('vgid')) {
                if ($wizard->param('servid')) {
                    if ($wizard->param('cancel')) {
                        $wizard->add(new Other_Confirm_Cancel(array(
                            'title' => 'Confirm cancel service assigning'
                        )));
                        $wizard->fin(new Other_Cancel);
                    } else {
                        $wizard->add(new Other_Date_Stop());
                        $wizard->add(new Other_Confirm_Stop);
                        $wizard->fin(new DTV_Additional_Stop);
                    }
                } else {
                    if ($wizard->param('common')) {
                        $wizard->add(new Other_Date_Assign);
                        $wizard->add(new Other_Confirm_Assign);
                        $wizard->fin(new DTV_Additional_Assign);
                    } else {
                        $wizard->add(new Other_Date_Assign_Nonrecurrent());
                        $wizard->add(new Other_Confirm_Assign_Nonrecurrent());
                        $wizard->fin(new Other_Assign_Nonrecurrent);
                    }
                }
            }
        }
        return $wizard;
    }
}

?>
