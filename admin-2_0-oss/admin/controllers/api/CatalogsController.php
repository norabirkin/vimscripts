<?php
class CatalogsController extends Controller {
    
    public function actionList() {
        $catalog = new Catalog;
        echo CJSON::encode( $catalog->getCatalogsTree() );
    }

    public function actionGet() {
        $result = yii::app()->japi->callAndSend('getCatalogs', array(
            'catalog_id' => (int) $this->param('id')
        ));
        if (!$result) {
            $this->error(yii::t('messages', 'Catalog not found'));
        }
        $result[0]['id'] = $result[0]['catalog_id'];
        $this->success($result[0]);
    }

    public function actionClone() {
        $this->success(yii::app()->japi->callAndSend('cloneCatalog', array(
            'catalog_id' => (int) $this->param('catalog_id'),
            'name' => (string) $this->param('name'),
            'new_operator_id' => (int) $this->param('new_operator_id'),
            'operator_id' => (int) $this->param('operator_id'),
            'type' => (int) $this->param('type')
        )));
    }
    
    public function actionCreate() {
        $this->success(yii::app()->japi->callAndSend('setCatalog', array(
            "name" => $this->param('name'),
            "type" => (int) $this->param("type"),
            "operator_id" => (int) $this->param("operator_id")
        )));
    }
    
    public function actionUpdate() {
        $this->success(yii::app()->japi->callAndSend('setCatalog', array(
            "catalog_id" =>  (int) $this->param('id'),
            "name" => $this->param('name'),
            "type" => (int) $this->param("type"),
            "operator_id" => (int) $this->param("operator_id")
        )));
    }
    
    public function actionDelete() {
        $this->success(yii::app()->japi->callAndSend('delCatalog', array(
            "catalog_id" =>  (int) $this->param('id')
        )));
    }
    
    public function actionImport() {
        $catalog = Catalog::factory(array(
            "type" => (int) $this->param('catalog_type'),
            "id" => (int) $this->param('catalog_id')
        ))->CSVImport();
        $this->success( true );
    }
    
    public function actionExport() {
        $this->downloadAction();
        try {
            $catalog = Catalog::factory(array(
                "type" => (int) $this->param('catalog_type'),
                "id" => (int) $this->param('catalog_id')
            ));
            if ($csv = $catalog->CSVExport()) {
                $catalog->sendCSVHeaders();
                echo $csv;
            } else {
                $this->downloadError( yii::t("messages", "unknown error") );
            }
        } catch ( Exception $e ) {
            $this->downloadError( yii::t("messages", "unknown error") );
        }
    }

} ?>
