<?php

class Antivirus_Confirm_Stop extends DTV_Confirm_Stop {
    protected function addDescr() {
        $externaldata = explode('#', $this->__service()->service->externaldata);
        
        if($this->helper()->isActive($this->__service())) {
            $text = yii::t('antivirus',"ConfirmStop", array(
                "{catdescr}" => $this->__service()->descr,
                "{key}" => $externaldata[0]
            ));
        } else {
            $text = yii::t('antivirus',"ConfirmUnactivatedStop", array(
                "{catdescr}" => $this->__service()->descr,
                "{key}" => $externaldata[0]
            ));
        }
        
        return array(
            'type' => 'display',
            'value' => '',
            'label' => $text
        );
    }
    protected function __form() {
        return $this->fnext(array(
            $this->addDescr()
        ));
    }
}

?>
