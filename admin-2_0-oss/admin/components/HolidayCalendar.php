<?php
class HolidayCalendar extends CalendarTable {
    private function param( $paramName ) {
        return yii::app()->controller->param( $paramName );
    }

    private function getCalculatedResult ($weekendRawData, $date) {

        $weekendData = array();
        $result = array();
        $month = array('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
        $startdate = getdate($this->calcCalendarDateFrom($date)); 
        
        foreach ($weekendRawData as $item) {
            $weekendData[$item['date']] = $item['is_holiday'];
        }

        for ($i = 0; $i < $this->dayscount; ++$i) {
            $datetime = mktime(0, 0, 0, $startdate["mon"],  $i + $startdate["mday"], $startdate["year"]);
            $recorddate = date("Y-m-d", $datetime);

            if ($weekendData[$recorddate]) {
                $result[] = array(
                    'date' => $recorddate, 
                    'is_holiday' => $weekendData[$recorddate]
                );
            } else {
                $result[] = array(
                    'date' => $recorddate, 
                    'is_holiday' => ( $month[$i%7] == 'sat' || $month[$i%7] == 'sun' )  ? 1 : 0
                );
            }
        }
        return $result;
    }
    
    public function getList() {

        if ((int)$this->param('year') && (int)$this->param('month')) {
            $date = new DateTime(date('Ymd', mktime(0, 0, 0, (int)$this->param('month'), 1,  (int)$this->param('year'))));
        } else {
            $date = new DateTime(date('Ymd'));
        }
        
        $startdatetime = $this->calcCalendarDateFrom($date);
        $enddatetime = $this->calcCalendarDateTo($startdatetime, $date);

        $weekendRawData = yii::app()->japi->callAndSend("getWeekends", array(
            'date_from' => date("Y-m-d", $startdatetime),
            'date_to' => date("Y-m-d", $enddatetime)
        ));

        $result = $this->getCalculatedResult($weekendRawData, $date);
        
        yii::app()->controller->success( $result );
    }
    
} ?>
