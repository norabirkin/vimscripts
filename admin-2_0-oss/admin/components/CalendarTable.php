<?php
class CalendarTable {
    protected $dayscount = 35;

    protected function calcCalendarDateFrom($date){

        for ($offset = 0; $offset < 7; ++$offset) {
            $startdatetime = mktime(0, 0, 0, $date->format("m"), 1-$offset, $date->format("Y"));
            $startdate = getdate($startdatetime);
            if ($startdate['weekday'] === 'Monday') {
                break;
            }
        }
        return $startdatetime;
    }

    protected function calcCalendarDateTo($startdatetime, $date) { 
        $startdate = getdate($startdatetime);
        $nextdatetime = mktime(0, 0, 0, $startdate["mon"],  $this->dayscount + $startdate["mday"], $startdate["year"]);
        $nextdate = getdate($nextdatetime);

        $enddatetime = mktime(0, 0, 0, $startdate["mon"],  $this->dayscount - 1 + $startdate["mday"], $startdate["year"]);
        $enddate = getdate($enddatetime);
        if ($enddate["mon"] == $date->format("m") && $nextdate["mon"] == $date->format("m")) {  
            $this->dayscount+=7;
            $enddatetime = mktime(0, 0, 0, $startdate["mon"],  $this->dayscount - 1 + $startdate["mday"], $startdate["year"]);
            $enddate = getdate($enddatetime);
        }
        return $enddatetime;
        
    }
    
} ?>
