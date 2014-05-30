<?php

class Antivirus_Services extends LBWizardStep {
    private function key($row) {
        if (!$row->service->externaldata) {
            return $this->t('Waiting for key');
        }
        $externaldata = explode('#', $row->service->externaldata);
        return CHtml::link($externaldata[0], $externaldata[1]);
    }
    private function state($row) {
        if ($this->helper()->isActive($row)) {
        	$status_text = Yii::t('antivirus', 'Active');
        	if ($this->vgroup()->vgroup->blocked == 4) {
        		$status_text = yii::t('antivirus', 'Blocked') ;
        	}
            return $status_text;
        } else {
            return Yii::t('antivirus', 'Unactivated', array ('{activated}' => date("d.m.y", strtotime($row->service->activated))));
        }
    }
    public function row($row) {
        if (!$this->isAntivirus($row)) {
            return null;
        }
        $row->key = $this->key($row);
        $row->state = $this->state($row);
        return $row;
    }
    public function isAntivirus($row) {
        if (!$this->helper()->isAntivirus($row)) {
            return null;
        }
        return $row;
    }
    public function columns($columns) {
        $columns = $this->assocIns($columns, 3, 'key', 'Key');
        $columns['state'] = 'State';
        return $columns;
    }
    public function output() {
        $params = MainTemplateHelper::GetInstance()->GetTheme()->getAntivirusModuleParams();
        $services = new Antivirus_Services_Grid(array(
            'wizard' => $this->wizard(),
            'multiple' => true
        ));
        return $services->active(array(
            'title' => $params['subscription'],
            'columns' => array($this, 'columns'),
            'processor' => array($this, 'row')
        )) .
        $services->idle(array(
            'title' => 'Order new key',
            'categoriesClass' => 'Antivirus_Usbox',
            'processor' => array($this, 'isAntivirus')
        ));
    }
    public function title() {
        return $this->t('Choose service');
    }
}

?>
