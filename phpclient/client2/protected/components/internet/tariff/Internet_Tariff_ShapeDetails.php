<?php

class Internet_Tariff_ShapeDetails {
    private $shape;
    public function row($vgroup, $table, $row) {
        $table->setRowClass($this->rowCls($vgroup));
        if (!$row) {
            return null;
        }
        $row['tarifdescr'] = $this->shapeDetails($vgroup);
        return $row;
    }
    private function rowCls($vgroup) {
        return 'internet-tariff-changing-vgroups-'.$vgroup->vgroup->vgid;
    }
    private function shapeDetails($vgroup) {
        ClientScriptRegistration::addScript('grid');
        ClientScriptRegistration::addScript('Details');
        ClientScriptRegistration::addScript('TarShape');
        return '<script type="text/javascript">$(document).ready(function(){$($(".'.$this->rowCls($vgroup).' td")[1]).append(TarShape.render({text:'.CJSON::encode($vgroup->vgroup->tarifdescr).',details:'.CJSON::encode($this->shape()->getShape($vgroup)).'}))});</script>';
    }
    private function shape() {
        if (!$this->shape) {
            yii::import('application.components.internet.Internet_Shape');
            $this->shape = new Internet_Shape;
        }
        return $this->shape;
    }
}

?>
