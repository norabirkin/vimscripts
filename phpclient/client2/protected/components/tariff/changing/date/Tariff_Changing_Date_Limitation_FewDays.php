<?php

class Tariff_Changing_Date_Limitation_FewDays extends Tariff_Changing_Date_Limitation {
    private $days;
    public function __construct($wizard, $days) {
        parent::__construct($wizard);
        $this->days = $days;
    }
    public function strict() {
        return false;
    }
    protected function __message() {
        return array('<strong>Attention!</strong> Tariff plan changing allowed not early than {date}!', array(
            '{date}'=> $this->minDate()
        ));
    }
    protected function __minDate() {
        return $this->min() + 86400 * $this->days;
    }
}

?>
