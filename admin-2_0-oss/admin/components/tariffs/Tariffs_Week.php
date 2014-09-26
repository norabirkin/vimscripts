<?php

class Tariffs_Week {
    private $days = array(
        'fri',
        'mon',
        'sat',
        'sun',
        'thu',
        'tue',
        'wed'
    );
    public function weekInline($week) {
        $result = array();
        foreach ($this->days as $day) {
            if ($week[$day]) {
                $result[] = $day;
            }
        }
        return implode(',', $result);
    }
    public function weekExploded($inline) {
        $result = array();
        $exploded = explode(',', $inline);
        foreach ($this->days as $day) {
            $result[$day] = in_array($day, $exploded) ? true : false;
        }
        return $result;
    }
}

?>
