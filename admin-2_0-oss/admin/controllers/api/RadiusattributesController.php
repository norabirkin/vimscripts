<?php
class RadiusattributesController extends Controller{
    
    public function actionList() {
        $params = array( 'include_default' => true );
        if ($this->param("nas_id")) {
            $params["nas_id"] = (int) $this->param("nas_id");
        }
        $this->success( yii::app()->japi->callAndSend('getDictionary', $params ));
    }

    public function actionCreate() {
        $params = array(
            'name' => $this->param('name'),
            'nas_id' => (int) $this->param('nas_id'),
            'radius_type' => (int) $this->param('radius_type'),
            'tagged' => (bool) $this->param('tagged'),
            'to_history' => (bool) $this->param('to_history'),
            'value_type' => (int) $this->param('value_type'),
            'vendor' => (int) $this->param('vendor')
        );
        if ($this->param('replace_id')) {
            $params["replace_id"] = $this->param('replace_id');
        }
        $this->success( yii::app()->japi->callAndSend('setDictionary', $params) );
    }

    public function actionUpdate() {
        $params = array(
            'record_id' => (int) $this->param('id'),
            'name' => $this->param('name'),
            'nas_id' => (int) $this->param('nas_id'),
            'radius_type' => (int) $this->param('radius_type'),
            'tagged' => (bool) $this->param('tagged'),
            'to_history' => (bool) $this->param('to_history'),
            'value_type' => (int) $this->param('value_type'),
            'vendor' => (int) $this->param('vendor')
        );
        if ($this->param('replace_id')) {
            $params["replace_id"] = $this->param('replace_id');
        }
        $this->success( yii::app()->japi->callAndSend('setDictionary', $params) );
    }

    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delDictionary', array(
            'record_id' => (int) $this->param("id")
        )));
    }

}
