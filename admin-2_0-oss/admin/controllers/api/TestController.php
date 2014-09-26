<?php
class TestController extends Controller {
    
    public function actionCombo() {
        sleep(2);
        $this->success(array(
            array( "id" => 1, "name" => "item-1" ),
            array( "id" => 2, "name" => "item-2" ),
            array( "id" => 3, "name" => "item-3" ),
            array( "id" => 4, "name" => "item-4" )
        ));
    }



    public function filters()
    {
        return array();
    }
    
    public function actionSession() {
        $this->sendResponse(200, array(
            "success" => true,
            "results" => $_SESSION
        ));
    }
    
    private function explainRequest($method) {
        
        $request = array();
        
        foreach (array('id', 'descr', 'name') as $paramName) {
            if (($param = $this->getRequest()->getParam($paramName, null)) !== null) {
                $request[$paramName] = $param;
            }
        }
        
        $this->sendResponse(200, array(
            "success" => true,
            "results" => array(
                'method' => $method,
                'request' => $request
            )
        ));
    }
    
    public function actionGet() {
        $this->explainRequest(__METHOD__);
    }
    
    public function actionList() {
        $this->explainRequest(__METHOD__);
    }
    
    public function actionCreate() {
        $this->explainRequest(__METHOD__);
    }
    
    public function actionUpdate() {
        $this->explainRequest(__METHOD__);
    }
    
    public function actionDelete() {
        $this->explainRequest(__METHOD__);
    }

} ?>
