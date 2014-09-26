<?php
class RadiusattributeslistController extends Controller{
    
    public function actionList() {
        $params = array();
        if ((int)$this->param("type") > 0) {
            $params['repdetail'] = (int)$this->param("type");
        }

        if ($this->param("search") != "") {
            $params['fullsearch'] = $this->param("search");
        }

        $result = yii::app()->japi->callAndSend('getRadiusAttrs', $params);
        foreach ($result as &$item) {
            if ($item['group_id'] > 0) {
                $item['link'] = 2;
            } elseif ($item['tar_id'] > 0) {
                $item['link'] = 3;
            } elseif ($item['vg_id'] > 0) {
                $item['link'] = 4;
            } elseif ($item['shape'] > 0) {
                $item['link'] = 5;
            } else {
                $item['link'] = 1;
            }

            if ($item['dev_group_id'] > 0) {
                $item['nas_id'] = -1;
            }
        }
        $this->success( $result );
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend('delRadiusAttr', array(
            "record_id" => (int) $this->getRequest()->getParam('record_id', 0)
        )));
    }

    public function actionSave() {

        $params = array(
            "attr_id"      => (int)$this->param("attr_id"),
            'cat_idx'   => 0,
            'description'  => (string)$this->param("description"),
            'dev_group_id'   => (int)$this->param("dev_group_id"),
            'group_id'   => 0,
            "id"      => (int)$this->param("id"),
            'nas_id'   => (int)$this->param("nas_id"),
            'radius_code'  => (int)$this->param("radius_code"),
            'record_id'   => (int)$this->param("record_id"),
            'service'   => (string)$this->param("service"),
            'service_for_list'      => (int)$this->param("service_for_list"),
            'shape'   => 0,
            'tag'  => (int)$this->param("tag") > 0 ? (int)$this->param("tag") : 0,
            'tar_id'   => 0,
            'value'   => (string)$this->param("value"),
            'vg_id'   => 0
        );

        switch((int)$this->param('link')) {
            case 2:
                $params['group_id'] = (int)$this->param('group_id');
            break;

            case 3:
                $params['tar_id'] = (int)$this->param('tar_id');
                $params['cat_idx'] = (int)$this->param('cat_idx');
            break;

            case 4:
                $params['vg_id'] = (int)$this->param('vg_id');
            break;

            case 5:
                $params['shape'] = (int)$this->param('shape');
            break;
        }

        $this->success( yii::app()->japi->callAndSend('setRadiusAttr', $params));
    }

} ?>
