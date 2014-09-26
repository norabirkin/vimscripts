<?php
class MacroroleController extends Controller {
    
    private $roles;
    
    public function actionGet() {
                
        $this->sendResponse(200, array(
            "success" => true,
            "results" => $this->roles->getMacroRole( (int) $this->getRequest()->getParam("id") )
        ));
        
    }
    
    public function init() {
        
        parent::init();
        
        $this->roles = new Roles;
        $this->roles->fake();
        
        
    }
    
} ?>
