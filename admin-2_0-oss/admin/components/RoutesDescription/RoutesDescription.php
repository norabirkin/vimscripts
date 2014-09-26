<?php
class RoutesDescription {
    
    public function run() {
        $this->render( $this->getRoutes() );
    }
    
    public function getRoutes() {
        return require(dirname(__FILE__) . DIRECTORY_SEPARATOR . "routes.php");
    }
    
    public function render( $routes ) {
        $html = '';
        foreach ($routes as $name => $data) {
            $r = '';
            $controller = ucfirst( $name ). "Controller";
            foreach ($data["routes"] as $k => $v) {
                $r .= yii::app()->controller->renderPartial("route", array(
                    "route" => "/api/" . $name . $v["route"],
                    "params" => $v["params"],
                    "method" => $this->HTTPMethod( $k ),
                    "descr" => $v["descr"],
                    "actionmethod" => $controller. '::action' . ucfirst($k) . '()'
                ), true);
            }
            $html .= yii::app()->controller->renderPartial("routes", array(
                "controller" => $controller, 
                "descr" => $data["descr"],
                "routes" => $r
            ), true);
        }
        yii::app()->controller->renderPartial("index", array("content" => $html));
    }
    
    public function HTTPMethod( $k ) {
        $methods = array(
            "get" => "GET",
            "list" => "GET",
            "delete" => "DELETE",
            "create" => "POST",
            "update" => "PUT"
        );
        $method =  $methods[ $k ];
        if (!$method) {
            $method = "ANY METHOD";
        }
        return $method;
    }
    
} ?>
