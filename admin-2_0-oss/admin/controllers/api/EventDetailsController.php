<?php

class EventDetailsController extends Controller {
    private $first = true;
    private $keys = array();
    private $results = array();
    public function actionList() {
        $this->success($this->process(
            yii::app()->japi->callAndSend('stat15', array(
                'repnum' => 15,
                'repdetail' => 1,
                'recordid' => (int) $this->param('record_id')
            ))
        ));
    }
    private function process($data) {
        if (
            !$data[0] ||
            !$data[0]['more']
        ) {
            return array();
        }
        foreach (
            explode(
                "\n",
                $data[0]['more']
            ) as
            $line
        ) {
            $this->line($line);
        }
        return $this->results;
    }
    private function line($line) {
        if (!$line) {
            return;
        }
        $line = explode("\t", $line);
        if ($this->first) {
            $this->keys = $line;
            $this->first = false;
        } else {
            $item = array();
            foreach ($line as $k => $v) {
                $item[$this->keys[$k]] = $v;
            }
            $this->results[] = $item;
        }
    }
}

?>
