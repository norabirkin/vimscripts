<?php

class EventsController extends Controller {
    public function actionList() {
        $list = new OSSListStatistics(array(
            'useSort' => false
        ));
        $list->get('stat15', array(
            'dtfrom' => (string) $this->param(
                'dtfrom',
                date(
                    'Y-m-d',
                    strtotime(
                        'first day of last month'
                    )
                )
            ),
            'dtto' => (string) $this->param(
                'dtto',
                date(
                    'Y-m-d',
                    strtotime(
                        'first day of next month'
                    )
                )
            ),
            'type' => (int) $this->param('type', 0),
            'personid' => (int) $this->param('person_id', 0),
            'code' => (string) $this->param('code', '2,3,4,5')
        ));
    }
}

?>
