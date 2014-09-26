<?php
class HolidaycalendarController extends Controller{

    public function actionList() {
        $holidayCalendar = new HolidayCalendar;
        $this->success( $holidayCalendar->getList() ); 
    }

    public function actionSave() {
        $saveholidays = $this->param("saveholidays");
        foreach ($saveholidays as $key => $item) { 
            $struct[] = array( 
                "date" => (string) $key, 
                "is_holiday" => $item == 1
            ); 
        }
        $this->success( yii::app()->japi->callAndSend('setWeekend', $struct));
    }

} ?>
