<?php

class DTV_Equipment_BindedTo extends LBWizardItem {
    public function __construct(LBWizard $wizard) {
        $this->setWizard($wizard);
    }
    public function row($item) {
        return array(
            'description' => $this->edit(array(
                'route' => 'editform/updateequipmentdescription',
                'id' => $item->equipment->equipid,
                'value' => $item->equipment->descr,
                'descr' => 'equipment-desc'
            )),
            'vglogin' => $item->vglogin,
            'equipid' => $item->equipment->equipid,
            'modelname' => $item->modelname,
            'serial' => $item->equipment->serial,
            'name' => $item->equipment->name,
            'agrmnum' => $item->agrmnum,
            'mac' => $item->equipment->mac,
            'chipid' => $item->equipment->chipid,
            'price' => $this->rent($item),
            'action' => $this->action($item)
        );
    }
    protected function columns() {
        return array(
            'name' => 'Name',
            'description' => 'Description',
            'serial' => 'Serial',
            'agrmnum' => 'Agreement number',
            'modelname' => 'Model name',
            'mac' => 'Mac',
            'chipid' => 'Chip ID',
            'price' => 'Price',
            'action' => 'Actions'
        );
    }
    protected function table($data) {
        return $this->grid(array(
            'title' => $this->title($data),
            'columns' => $this->columns(),
            'data' => $this->listData($data),
            'processor' => array($this, 'row')
        ));
    }
    protected function listData($data) {
        return $data->equipment;
    }
    protected function edit($params) {
        return '<span id="editable-value-'.$params['descr'].'-'.$params['id'].'">'.$params['value'].'</span>' . yii::app()->controller->widget('ext.LB.widgets.Edit', array(
            'id' => $params['descr'] . '-' . $params['id'],
            'route' => $params['route'],
            'data' => array(
                'id' => $params['id']
            )
        ), true);
    }
    private function rent($item) {
        try {
            if ($service = $this->usbox()->active()->get($item->equipment->servid)) {
                return $this->price($service->above);
            } else {
                return '';
            }
        } catch (Exception $e) {
            return '';
        }
    }
    protected function action($item) {
        return '';
    }
}

?>
