<?php

class DTV_Channels_Thanks extends LBWizardStep {
    public function output() {
        return $this->t('Thanks for subscribing') . '<br/>' .
        $this->t('Go to personal TV page') . ' ' . $this->link('link', 2, array(
            'personal' => 1
        ), array('catidx'));
    }
    public function title() {
        return 'Thank you';
    }
}

?>
