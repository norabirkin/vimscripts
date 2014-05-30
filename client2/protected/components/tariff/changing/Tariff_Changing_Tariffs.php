<?php

class Tariff_Changing_Tariffs extends LBWizardStep {
    public function row($row) {
        $tariff = $this->g('getTarif', array(
            'id' => $row->tarid
        ));
        if ($tariff->tarif->unavaliable) {
            return null;
        }
        return array(
            'tarname' => $this->lnext(
                $row->tarname . LB_Style::info($tariff->tarif->link),
                array(
                    'tarid' => $row->tarid
                )
            ),
            'rent' => $this->price($this->getRent($row->tarid)),
            'tardescrfull' => $row->tardescrfull
        );
    }
    private function getRent($tarifid) {
        $rent = 0;
        foreach ($this->usbox(array(
            'tarifid' => $tarifid
        ))
        ->categories()
        ->all(false) as $category) {
            if ($category->autoassign) {
                $rent += $category->above;
            }
        }
        return $rent;
    }
    public function output() {
        return $this->grid(array(
            'title' => 'Tariffs available for change',
            'columns' => array(
                'tarname' => 'Tariff name',
                'tardescrfull' => 'Description',
                'rent' => 'Rent'
            ),
            'data' => $this->tarstaff(),
            'processor' => array($this, 'row')
        ))->render();
    }
    public function title() {
        return 'Tariff choice';
    }
}

?>
