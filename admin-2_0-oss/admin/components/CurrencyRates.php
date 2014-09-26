<?php
class CurrencyRates extends CalendarTable {
    private function param( $paramName ) {
        return yii::app()->controller->param( $paramName );
    }

    private function getRateResult ($rateData, $date) {
        $result = array();
        $counter = 0;
        $month = array('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
        $item = array('id' => count($result), 'currentmonth' =>$date->format('m'), 'currentdate' => $date->format("Ymd"));
        $startdate = getdate($this->calcCalendarDateFrom($date)); 
        for ($i = 0; $i < $this->dayscount; ++$i) {
            $datetime = mktime(0, 0, 0, $startdate["mon"],  $i + $startdate["mday"], $startdate["year"]);
            $recorddate = date("Y-m-d", $datetime);
            if ($rateData[$counter]["date"] == $recorddate) {
                $item[$month[$i%7]] = array(
                    "date" => $recorddate,
                    "rate" => $rateData[$counter]['rate']
                );
                ++$counter;
            } else {
                $item[$month[$i%7]] = array (
                    "date" => $recorddate,
                    "rate" => "Undefined"
                );
            }
            if ($month[$i%7] == 'sun') {
                $result[] = $item;
                $item = array(
                    'id' => count($result),
                    'currentmonth' => $date->format('m'),
                    'currentdate' => $date->format("Ymd"),
                    'cur_id'=> $rateData[$counter]['cur_id']
                );
            }
        }
        return $result;
    }
    
    public function getList() {

        if ((int)$this->param('currentdate')) {
            $date = new DateTime(date('Ymd', strtotime($this->param('currentdate'))));
        } else {
            $date = new DateTime(date('Ymd'));
        }
        
        if ((int)$this->param('next') == 1) {
            $date->modify("+1 month");
        }
        
        if ((int)$this->param('prev') == 1) {
            $date->modify("-1 month");
        }
        

        $startdatetime = $this->calcCalendarDateFrom($date);
        $enddatetime = $this->calcCalendarDateTo($startdatetime, $date);

        $rateData = yii::app()->japi->callAndSend("getRates", array(
            'date_from' => date("Y-m-d", $startdatetime),
            'date_to' => date("Y-m-d", $enddatetime),
            'cur_id' => (int) $this->param('cur_id')
        ));

        $result = $this->getRateResult($rateData, $date);
        
        yii::app()->controller->success( $result );
    }
    
} ?>
