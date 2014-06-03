<?php

class Internet_MAC_Grid extends LBWizardStep {
    public function row($row) {
        return array(
            'mac' => $this->lnext($row->mac, array(
                'macid' => $row->macid
            )),
            'segment' => $row->segment
        );
    }
    public function output() {
        return $this->grid(array(
            'title' => array('MAC-addresses ({login})', array(
                '{login}' => $this->vgroup()->vgroup->login
            )),
            'columns' => array(
                'mac' => 'MAC-address',
                'segment' => 'IP'
            ),
            'data' => $this->helper()->macs(),
            'processor' => array($this, 'row')
        ))->render();
    }
    public function title() {
        return yii::t('main', 'MAC-addresses');
    }
}

?>
