<?php
class CatalogzonesController extends Controller {
    
    public function actionCreate() {
        $this->setZone();
    }
    
    public function actionUpdate() {
        $this->setZone();
    }
    
    public function actionList() {
        $zones = Catalog::factory(array(
            "type" => (int) $this->param('catalog_type', 0),
            "id" => (int) $this->param('catalog_id', 0)
        ))->getZonePaginated();
        
        $this->success( $zones[ "items" ], $zones[ "total" ] );
    }
    
    public function actionGet() {
        $zone = Catalog::factory(array(
            "type" => (int) $this->param('catalog_type', 0),
            "id" => (int) $this->param('catalog_id', 0)
        ))->getZone( $this->param("id", 0) );

        $this->success( $zone );
    }
    
    public function actionDeletelist() {
        $success = Catalog::factory(array(
            "type" => (int) $this->param('catalog_type', 0)
        ))->delZones( $this->param("list") );
    
        $this->success( $success );
    }
    
    public function actionDelete() {
        $success = Catalog::factory(array(
            "type" => (int) $this->param('catalog_type', 0)
        ))->delZone( $this->param("id", 0) );
    
        $this->success( $success );
    }
    
    private function setZone() {
        $success = Catalog::factory(array(
            "type" => (int) $this->param('catalog_type', 0),
            "id" => (int) $this->param('catalog_id', 0)
        ))->setZone();
        
        $this->success( $success );
    }
    
} ?>
