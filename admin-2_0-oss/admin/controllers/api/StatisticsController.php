<?php
class StatisticsController extends Controller{

    public function actionList() {
        $statistics = $this->getStatistics();
        $this->success( $statistics['result']->getResult(), $statistics['total']->getResult() );
    }

    private function getStatistics() {
        $list = new OSSListStatistics( array("useSort" => false) );
        if ( $this->param('date_from') AND $this->param('date_to') ) {
            $params = array(
                'dtfrom' => $this->param('date_from'),
                'dtto' => $this->param('date_to')
            );
        } else {
            $params = array();
        }
        foreach (array(
            'agrmnum',
            'vglogin',
            'ip',
            'ani',
            'name'
        ) as $param) {
            if ($this->param($param)) {
                $params[$param] = (string) $this->param($param);
            }
        }
        foreach (array(
            'agentid',
            'showdef',
            'repdetail',
            'vgid',
            'operid',
            'ugroups',
            'agrmid'
        ) as $param) {
            if ($this->param($param)) {
                $params[$param] = (int) $this->param($param);
            }
        }
        if ($this->param("emptyamount")) {
            $params["amountfrom"] = (float) $this->param("emptyamount");
        }
        if ($this->param("search") AND $this->param("property")) {
            $params[$this->param("property")] = $this->param("search");
        }
        return $list->getList("stat" . $this->param("repnum", 1), $params );
    }

    public function actionStopsession() {
        $ids = explode( ".", $this->param("list", "") );
        if (!$ids) {
            $this->error();
        }
        foreach ($ids as $id) {
            yii::app()->japi->call('stopRadiusSession', array(
                'id' => $this->param('agentid'), 
                'sessionid' => $id
            ));
        }
        yii::app()->japi->send( true );
        $this->success();
    }

    public function actionExport() {
        $columns = CJSON::decode($this->param('columns'), true);
        $this->downloadAction();
        $data = array($columns["names"]);
        $history = $this->getStatistics();
        foreach ($history["result"]->getResult() as $payment) {
            $item = array();
            foreach ($columns["fields"] as $column) {
                $item[$column] = $payment[$column];
            }
            $data[] = $item;
        }
        $csv = new CSV;
        $csv->sendCSVHeaders('statistics.csv');
        echo $csv->arrayToCSV( $data );
    }
    
} ?>
