<?php

class Antivirus_Action extends Tariff_Action {
    public function __getWizard() {
        if (!$this->isAntivirusAvailable()) {
            yii::app()->controller->redirect(array('antivirus/fail'));
        }
        $wizard = new LBWizard(array(
            'steps' => array(
                new Antivirus_Vgroups,
                new Antivirus_Services
            ),
            'helper' => new Antivirus_Helper,
            'style' => 'steps',
            'count' => 3
        ));
        if ($wizard->param('catidx') !== null) {
            $wizard->add(new Antivirus_Assign_Confirm(array(
                'title' => 'Confirm assign antivirus service',
                'catdescr' => 'Service name',
                'multiple' => true
            )));
            $wizard->fin(new Antivirus_Assign(true));
        } elseif ($wizard->param('servid')) {
        	if($wizard->param('state') == 'active') {
        		$wizard->add(new Antivirus_Confirm_Stop(array(
        			'title' => Yii::t('antivirus', 'StopConfirmation'), 
        			'catdescr' => 'Service name'
        		)));
        	} else {
        		$wizard->add(new Antivirus_Confirm_Stop(array(
        			'title' => Yii::t('antivirus','Confirm to delete'),
        			'catdescr' => 'Service name'
        		)));
        	}
            $wizard->fin(new DTV_Additional_Stop);
        }
        return $wizard;
    }
    private function isAntivirusAvailable() {
        return true;
        return $this->g('checkAntivirusService');
    }
    protected function __tariffType() {
        return new Services_Tariff_Type;
    }
}

?>
