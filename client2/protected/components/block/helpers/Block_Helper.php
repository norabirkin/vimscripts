<?php

class Block_Helper extends LBWizardItem {
    const ACTIVE = 0;
    const INSUFFICIENT_FUNDS_1 = 1;
    const SWITCHED_OFF_BY_USER = 2;
    const SWITCHED_OFF_BY_ADMINISTRATOR = 3;
    const INSUFFICIENT_FUNDS_2 = 4;
    const LIMIT_EXHAUSTED = 5;
    const SWITCHED_OFF = 10;
    public static function stateDescription($blocked) {
        switch ($blocked) {
            case Block_Helper::ACTIVE:
                return 'Active';
                break;
            case Block_Helper::INSUFFICIENT_FUNDS_1:
                return 'Insufficient funds';
                break;
            case Block_Helper::SWITCHED_OFF_BY_USER:
                return 'Switched off by user';
                break;
            case Block_Helper::SWITCHED_OFF_BY_ADMINISTRATOR:
                return 'Switched off by administrator';
                break;
            case Block_Helper::INSUFFICIENT_FUNDS_2:
                return 'Insufficient funds';
                break;
            case Block_Helper::LIMIT_EXHAUSTED:
                return 'Limit exhausted';
                break;
            case Block_Helper::SWITCHED_OFF:
                return 'Switched off';
                break;
        }

    }
    public function checkCancel() {
        if (!$this->hasStateChangingScheduledByClient($this->vgroup())) {
            throw new Exception('Cannot cancel state changing');
        }
    }
    public function checkDate() {
        if (
            !preg_match('/[0-9]{4}-[0-9]{2}-[0-9]{2}/', $this->param('date'))
            OR
            $this->minDate() > strtotime($this->param('date'))
        ) {
            throw new Exception('Invalid date');
        }
    }
    public function checkBlkreq() {
        if (!$this->canChangeState($this->vgroup())) {
            throw new Exception('Cannot change state');
        }
        if ($this->vgroup()->vgroup->blocked == self::ACTIVE AND $this->param('blkreq') == self::SWITCHED_OFF_BY_USER) {
            return;
        }
        if ($this->vgroup()->vgroup->blocked == self::SWITCHED_OFF_BY_USER AND $this->param('blkreq') == self::ACTIVE) {
            return;
        }
        throw new Exception('Cannot change state');
    }
    public function cancelChangeStateText($vgroup) {
        if ($vgroup->blockrasp->blkreq == self::ACTIVE) {
            return 'Cancel unlocking';
        } elseif ($vgroup->blockrasp->blkreq == self::SWITCHED_OFF_BY_USER) {
            return 'Cancel locking';
        }
    }
    public function hasStateChangingScheduledByClient($vgroup) {
        if ($this->hasNoStateChangingSchedule($vgroup)) {
            return false;
        }
        if (is_array($vgroup->blockrasp)) {
            return false;
        }
        if ($vgroup->blockrasp->requestby != -1) {
            return false;
        }
        if ($vgroup->blockrasp->blkreq != self::ACTIVE AND $vgroup->blockrasp->blkreq != self::SWITCHED_OFF_BY_USER) {
            return false;
        }
        return true;
    }
    public function hasStateChangingScheduledByAdministrator($vgroup) {
        if ($this->hasNoStateChangingSchedule($vgroup)) {
            return false;
        }
        return !$this->hasStateChangingScheduledByClient( $vgroup );
    }
    public function hasNoStateChangingSchedule($vgroup) {
        return !isset($vgroup->blockrasp) OR !$vgroup->blockrasp;
    }
    public function canChangeState($vgroup) {
        if ($this->hasStateChangingScheduledByAdministrator($vgroup)) {
            return false;
        }
        return $vgroup->vgroup->blocked == self::SWITCHED_OFF_BY_USER OR $vgroup->vgroup->blocked == self::ACTIVE;
    }

    private function currentTime() {
        return strtotime( date('Y-m-d') );
    }
    private function nextDay() {
        return $this->currentTime() + 86400;
    }
    private function dateLimitParameter() {
        switch ($this->param('blkreq')) {
            case self::ACTIVE:
                return 'allow_unblock_immediately';
                break;
            case self::SWITCHED_OFF_BY_USER:
                return 'allow_block_immediately';
                break;
            default:
                throw new Exception('Invalild state');
                break;
        }
    }
    public function minDate() {
        if (yii::app()->params['block'][$this->dateLimitParameter()]) {
            return $this->currentTime();
        }
        else {
            return $this->nextDay();
        }
    }
    public function assignedServices_ThatCanBeKeptTurnedOn() {
        return $this->usbox(array(
            'vgid' => $this->param('vgid'),
            'common' => 1,
            'keepturnedon' => 1
        ))->active();
    }
}

?>
