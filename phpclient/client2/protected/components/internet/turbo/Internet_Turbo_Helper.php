<?php

class Internet_Turbo_Helper extends LBWizardItem {
    private $service;
    public function services() {
        $data = array();
        foreach ($this->vgroups($this->vgroup()->vgroup->agrmid) as $vgroup) {
            if ($vgroup->vgroup->tariftype != 5) {
                continue;
            }
            foreach ($this->usbox(array(
                'vgid' => $vgroup->vgroup->vgid,
            ))->categories()->all(false) as $category) {
                if ($this->isTurboService($category)) {
                    $data[$category->tarid.'.'.$category->catidx] = $category;
                }
            }
        }
        return $data;
    }
    public function checkBalance() {
        if (
            ((int) $this->param('mul')) < yii::app()->params['turbo']['minDuration']
            OR
            ((int) $this->param('mul')) > yii::app()->params['turbo']['maxDuration']
        ) {
            throw new Exception('Invalid duration');
        }
        if ($this->totalAbove() > $this->totalBalance()) {
            throw new Exception('Low balance');
        }
    }
    public function totalAbove() {
        return ((int) $this->param('mul')) * $this->service()->above;
    }
    public function totalBalance() {
        return $this->agreement()->balance + $this->agreement()->credit;
    }
    public function service() {
        if (!$this->service) {
            foreach ($this->services() as $category) {
                if ($category->catidx == $this->param('catidx')) {
                    $this->service = $category;
                    break;
                }
            }
            if (!$this->service) {
                throw new Exception('Service not found');
            }
        }
        return $this->service;
    }
    public function isTurboService($category) {
        return $category->available
        AND (
            yii::app()->params['turbo']['longActionService']
            OR
            !$category->common
        )
        AND preg_match(yii::app()->params['turbo']['categoryPrefix'], $category->uuid);
    }
}

?>
