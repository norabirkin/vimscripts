<?php

class Tariff_Changing_Helper extends Tariff_Helper {
    private $schedule;
    private $newTariff;
    public function validateTariff() {
        if ($this->balance() < $this->rent()) {
            $this->flash('error', 'Not enough balance to assign selected tariff. Please refill your balance.');
            yii::app()->controller->redirect(array('payment/pay'));
        }
        if (!$this->wizard()->executingFinal() AND !$this->canChangeTariffBack()) {
            $this->flash('error', 'You cannot change tariff back, when you assign selected tariff');
        }
    }
    public function validateVgid() {
        if ($this->vgroup()->vgroup->blocked) {
            throw new Exception('Account is blocked');
        }
        foreach ($this->tarrasp() as $item) {
            if ($this->byUser($item)) {
                throw new Exception('Please remove allready scheduled tariff change');
            }
        }
    }
    public function validateDtfrom() {
        if (!$this->isDtfromValid()) {
            throw new Exception('Date is invalid');
        }
    }
    private function isDtfromValid() {
        if ($this->dateLimitation()->strict()) {
            if ($this->dateLimitation()->minDate() != $this->param('changetime')) {
                return false;
            }
        }
        if (strtotime($this->dateLimitation()->minDate()) > strtotime($this->param('changetime'))) {
            return false;
        }
        return true;
    }
    public function dateLimitation() {
        return Tariff_Changing_Date_Limitation::get($this->wizard());
    }
    private function canChangeTariffBack() {
        foreach ($this->tarstaffOfNewTariff() as $tariff) {
            if ($tariff->tarid == $this->vgroup()->vgroup->tarifid) {
                return true;
            }
        }
        return false;
    }
    private function tarstaffOfNewTariff() {
        return $this->a('getTarifsStaff', array(
            'filter' => array(
                'groupid' => $this->newTariff()->groupid,
                'grouptarid' => $this->param('tarid'),
                'groupmoduleid' => $this->newTariff()->groupmoduleid,
                'tarid' => $this->param('tarid')
            )
        ));
    }
    public function newTariff() {
        if (!$this->newTariff) {
            foreach ($this->tarstaff() as $tariff) {
                if ($tariff->tarid == $this->param('tarid')) {
                    $this->newTariff = $tariff;
                    break;
                }
            }
        }
        if (!$this->newTariff) {
            throw new Exception('Tariff not found');
        }
        return $this->newTariff;
    }
    private function balance() {
        return round($this->agreement()->balance + $this->agreement()->credit);
    }
    private function rent() {
        return round($this->g('getRentAmount', array(
            'vgid' => $this->param('vgid'),
            'tarid' => $this->param('tarid')
        )));
    }
    public function schedule() {
        if (!$this->schedule) {
            $this->schedule = new Tariff_Changing_Schedule_Data($this->wizard());
        }
        return $this->schedule;
    }
}

?>
