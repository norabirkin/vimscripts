<?php

class Tariff_Changing_Date_Limitation extends LBWizardItem {
    private static $instance;
    public static function get($wizard) {
        if (!self::$instance) {
            if (self::config('schedule_month_start_strict')) {
                self::$instance = new Tariff_Changing_Date_Limitation_MonthStart_Strict($wizard);
            } elseif (self::config('schedule_month_start')) {
                self::$instance = new Tariff_Changing_Date_Limitation_MonthStart($wizard);
            } elseif (($days = ((int) self::config('schedule_period_limit'))) >= 1) {
                self::$instance = new Tariff_Changing_Date_Limitation_FewDays($wizard, $days);
            } else {
                self::$instance = new Tariff_Changing_Date_Limitation_Default($wizard);
            }
        }
        return self::$instance;
    }
    static private function config($param) {
        return yii::app()->params[$param];
    }
    public function __construct($wizard) {
        $this->setWizard($wizard);
    }
    public function strict() {
        throw new Exception('Define "strict" method');
    }
    public function message() {
        return $this->t($this->__message());
    }
    public function minDate() {
        return date('Y-m-d', $this->__minDate());
    }
    protected function __message() {
        throw new Exception('Define "__message" method');
    }
    protected function __minDate() {
        throw new Exception('Define "__minDate" method');
    }
    protected function min() {
        return $this->tarrasp() ? $this->lastTariffChange() : $this->now();
    }
    private function now() {
        return (int) mktime(0,0,0,date('m'),date('d'),date('Y'));
    }
    private function lastTariffChange() {
        $dates = array();
        foreach ($this->tarrasp() as $tariff) {
            $dates[] = (int) strtotime($tariff->changetime);
        }
        return max($dates);
    }
}

?>
