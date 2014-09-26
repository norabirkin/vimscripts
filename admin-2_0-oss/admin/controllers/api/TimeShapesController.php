<?php

class TimeShapesController extends Controller {
    public function actionDeletelist() {
        $this->deleteList('delTarTimeShape', 'id');
    }
    public function actionList() {
        yii::import('application.components.tariffs.Tariffs_Week');
        $week = new Tariffs_Week;
        $results = array();
        $shapes = yii::app()->japi->callAndSend('getTarTimeShapes', array(
            'tar_id' => (int) $this->param('tar_id')
        ));
        foreach ($shapes as $shape) {
            $results[] = array(
                'id' => $shape['id'],
                'shape_rate' => $shape['shape_rate'],
                'tar_id' => $shape['tar_id'],
                'time_from' => $shape['time_from'],
                'time_to' => $shape['time_to'],
                'use_weekend' => (int) $shape['use_weekend'],
                'inline' => $week->weekInline($shape['week'])
            );
        }
        $this->success($results);
    }
    public function actionUpdate() {
        $this->save(array(
            'id' => (int) $this->param('id')
        ));
    }
    public function actionCreate() {
        $this->save();
    }
    private function save($params = array()) {
        yii::import('application.components.tariffs.Tariffs_Week');
        $week = new Tariffs_Week;
        $this->success(yii::app()->japi->callAndSend('setTarTimeShape', array_merge(array(
            'shape_rate' => (int) $this->param('shape_rate'),
            'tar_id' => (int) $this->param('tar_id'),
            'time_from' => (string) $this->param('time_from'),
            'time_to' => (string) $this->param('time_to'),
            'use_weekend' => (bool) $this->param('use_weekend'),
            'week' => $week->weekExploded((string) $this->param('inline'))
        ), $params)));
    }
}

?>
