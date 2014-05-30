<?php

class Internet_Tariff_History_Vgroups extends Vgroups_Grid {
    private $shapeDetails;
    public function row($vgroup, $table) {
        return $this->shapeDetails()->row($vgroup, $table, parent::row($vgroup));
    }
    private function shapeDetails() {
        if (!$this->shapeDetails) {
            yii::import('application.components.internet.tariff.Internet_Tariff_ShapeDetails');
            $this->shapeDetails = new Internet_Tariff_ShapeDetails;
        }
        return $this->shapeDetails;
    }
}

?>
