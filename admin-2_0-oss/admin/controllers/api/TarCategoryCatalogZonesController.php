<?php

class TarCategoryCatalogZonesController extends Controller {
    public function actionList() {
        $data = Catalog::factory(array(
            "type" => (int) $this->param('catalog_type')
        ))->tarCategoryZones();
        $this->success($data['result'], $data['total']);
    }
    public function actionAttach() {
        $this->update('setTarCategoryZone');
    }
    public function actionDetach() {
        $this->update('delTarCategoryZone');
    }
    private function update($method) {
        $params = array(
            'cat_idx' => (int) $this->param('cat_idx'),
            'catalog_id' => (int) $this->param('catalog_id'),
            'tar_id' => (int) $this->param('tar_id')
        );
        if ((int) $this->param('direction')) {
            $params['direction'] = (int) $this->param('direction');
        }
        if (!(string) $this->param('ids')) {
            $this->success(yii::app()->japi->callAndSend(
                $method,
                array_merge(
                    $params,
                    array(
                        'fullsearch' => (string) $this->param('fullsearch')
                    )
                )
            ));
        }
        $ids = array();
        foreach (explode(',', (string) $this->param('ids')) as $id) {
            $ids[] = (int) $id;
        }
        $this->success(yii::app()->japi->callAndSend(
            $method,
            array_merge(
                $params,
                array(
                    'zone_ids' => $ids
                )
            )
        ));
    }
}

?>
