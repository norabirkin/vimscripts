<?php

/**
 * Управление расписанием смены тарифов
 */
class tarif_change_schedule 
{
    /**
     * Учетная запись
     */
    private $vgroup;
    /**
     * Ограничение даты смены тарифа. Массив из двух элементов. Элемент с ключом "date" - дата, элемент с ключом "strict" характеризует способ ограничения. Если элемент с ключом "strict" равен true, то пользователь может запланировать смену тарифа только на указанную в элементе с ключом "date" дату, если элемент с ключом "strict" равен false, то пользователь может запланировать смену тарифа не раньше чем на дату, указанную в элементе с ключом "date"
     */
    public $limit_of_tarif_change_date;
    /**
     * Расписание смены тарифов
     */
    public $schedule;
    /**
     * Расписание смен тарифов, запланированных пользователем
     */
    public $schedule_enrties_added_by_user;
    
    function __construct($current_vgroup) {
        $this->vgroup = $current_vgroup;
        $this->schedule = $this->get_array($this->vgroup->tarrasp);
        $this->schedule_enrties_added_by_user = $this->get_schedule_enrties_added_by_user();
    }
    /**
     * Проверка наличия запланированной пользователем смены тарифа
     */
    public static function check_requests($current_vgroup) {
        //return true;
        $tcs = new self($current_vgroup);
        if ($tcs->schedule_enrties_added_by_user) return false;
        return true;
    }
    /**
     * Проверка даты
     */
    public function check_date($timestamp) {
        $date_limit = strtotime($this->limit_of_tarif_change_date['date']);
        if ( $timestamp == $date_limit ) return true;
        if ( !$this->limit_of_tarif_change_date['strict'] AND ( $timestamp > $date_limit ) ) return true;
        return false;
    }
    /**
     * Запланировать смену тарифа
     */
    public function schedule_tarif_change($date,$tarif) {
        $date_picker = explode('.', $date);
        $timestamp = strtotime(implode('-',array($date_picker[2],$date_picker[1],$date_picker[0])));
        if (!$this->check_date($timestamp)) return false;
        $date = date('Ymd000000',$timestamp);
        $struct = array(
            "recordid" => 0,
            "vgid" => $this->vgroup->vgroup->vgid,
            "groupid" => 0,
            "id" => (integer)$this->vgroup->vgroup->agentid,
            "taridnew" => $tarif,
            "taridold" => $this->vgroup->vgroup->tarifid,
            "changetime" => $date,
            "requestby" => ""
       );
       return yii::app()->controller->lanbilling->save("insClientTarifsRasp", $struct, false, array("getClientVgroups"));
    }
    
    function get_array($var) {
        if (!$var) return array();
        return is_array($var) ? $var : array($var);
    }
    
    function get_schedule_enrties_added_by_user() {
        $schedule = array();
        foreach ($this->schedule as $s) {
            if ($s->requestby == 'null') $schedule[] = $s;
        }
        return $schedule;
    }
    /**
     * Начало следующего месяца относительно определенной даты
     */
    function get_next_month_start($current_timestamp) {
        $month = date('n',$current_timestamp);
        $year = date('Y',$current_timestamp);
        if ($month == 12) {
            $next_month = 1;
            $year = $year+1;
        }
        else $next_month = $month + 1;
        if ($next_month < 10) $next_month = '0'.$next_month;
        return $year."-".$next_month."-01 00:00:00";
    }
    /**
     * Смещение на несколько суток относительно определенной даты
     */
    function displace_date($current_timestamp,$displacement) {
        return date("Y-m-d H:i:s", $current_timestamp + 86400*$displacement);
    }
    
    function get_limit_of_tarif_change_date () {
        $strict = false;
        $last_tarif_change_date = $this->get_last_tarif_change_date();
        
        //Смена тарифа с начала следующего месяца
        if ( (defined('SCHEDULE_MONTH_START') AND SCHEDULE_MONTH_START) OR (defined('SCHEDULE_MONTH_START_STRICT') AND SCHEDULE_MONTH_START_STRICT) ) {
            $date = $this->get_next_month_start($last_tarif_change_date);
            if (defined('SCHEDULE_MONTH_START_STRICT') AND SCHEDULE_MONTH_START_STRICT) $strict = true;
        }
        
        //Смена тарифа по истечении указанного срока
        elseif (defined('SCHEDULE_PERIOD_LIMIT') AND SCHEDULE_PERIOD_LIMIT) {
            $date = $this->displace_date($last_tarif_change_date, SCHEDULE_PERIOD_LIMIT);
        } else throw new Exception('Режим ограничения даты смены тарифа не установлен');
        
        $this->limit_of_tarif_change_date = array(
            'date' => $date,
            'strict' => $strict
        );
    }
    /**
     * Дата последней смены тарифа
     */
    function get_last_tarif_change_date() {
        $dates[] = (int) time();
        foreach ($this->schedule as $s) $dates[] = (int)strtotime($s->changetime);
        return max($dates);
    }
}

?>
