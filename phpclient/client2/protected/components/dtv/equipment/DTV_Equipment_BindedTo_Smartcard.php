<?php

class DTV_Equipment_BindedTo_Smartcard extends DTV_Equipment_BindedTo {
    public function output() {
        $html = '';
        foreach($this->wizard()->helper()->eq()->smartcards() as $smartcard) {
            $html .= $this->item($smartcard);
        }
        return $html;
    }
    protected function title($data) {
        return '';
    }
    protected function item($smartcard) {
        return $this->render(array(
            'descr' => $this->edit(array(
                'route' => 'editform/updateequipmentdescription',
                'id' => $smartcard->smartcard->cardid,
                'value' => $smartcard->smartcard->descr,
                'descr' => 'equipment-desc'
            )),
            'cardid' => $smartcard->smartcard->cardid,
            'grid' => $this->table($smartcard)->render(),
            'name' => $smartcard->smartcard->name,
            'serial' => $smartcard->smartcard->serial,
            'joineq' => $this->join($smartcard->smartcard->cardid),
            'message' => $this->message($smartcard->smartcard->cardid)
        ));
    }
    private function join($cardid) {
        if (!$this->wizard()->helper()->mobil()->allowJoin($cardid)) {
            return '';
        }
        return $this->lnext('Join equipment', array(
            'cardid' => $cardid,
            'action' => 'join'
        ));
    }
    private function message($cardid) {
        if ($this->wizard()->helper()->mobil()->allowJoin($cardid)) {
            return '';
        }
        if ($this->wizard()->helper()->mobil()->count($cardid) < $this->option("smartcard_eqip_max")) {
            return LB_Style::warning('Please contact to manager to link more equipment');
        }
        return '';
    }
    private function render($params) {
        return yii::app()->controller->renderPartial('application.components.dtv.equipment.views.smartcard', $params, true);
    }
    protected function action($equipment) {
        return $this->lnext('Detach', array(
            'equipid' => $equipment->equipment->equipid,
            'cardid' => 0,
            'action' => 'detach'
        ));
    }
}

?>
