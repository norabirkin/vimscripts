<?php class Antivirus extends CApplicationComponent {
    
    public $categoryPrefix;
    private $waitingPeriod;
    private $vgroups = array();
    private $availableAntivirusServices = array();
    private $assignedAntivirusServices = array();
    private $tariffCategories = array();
    public static function getLocalizeFileName() {
        return "antivirus";
    }
    private function getCategoryPrefix() {
        if ( !$this->categoryPrefix ) $this->categoryPrefix = "Antivirus#";
        return $this->categoryPrefix;
    }
    private function getWaitingPeriod() {
        if ( !$this->waitingPeriod ) $this->waitingPeriod = 60 * 60 * 24 * 7;
        return $this->waitingPeriod;
    }
    public function getInfoLink($link) {
        $link_img = CHtml::image(Yii::app()->theme->baseUrl.'/i/b_info.gif','info');
        $link = (!$link) ? '' :'&nbsp;&nbsp;'.CHtml::link($link_img, $link, array('class' => 'no_border'));
        return $link;
    }
    public function getServiceTimeto() {
        return  date( 'Y-m-d 00:00:00', time() + $this->getWaitingPeriod() );
    }
    public function isAvailableAntivirusService( $service ) {
        return substr($service->uuid, 0 ,strlen( $this->getCategoryPrefix() )) == $this->getCategoryPrefix();
    }
    private function getVgroups() {
        if ( !$this->vgroups ) {
            if ( !($result = yii::app()->controller->lanbilling->getRows( 'getClientVgroups' )) ) throw new Exception( yii::t( self::getLocalizeFileName(), "NoVgroups" ) );
            foreach ( $result as $item ) {
                if ( $item->vgroup->tariftype == 5 ) $this->vgroups[] = $item->vgroup;
            }
            if ( !$this->vgroups ) throw new Exception( yii::t( self::getLocalizeFileName(), "NoUSBoxVgroups" ) );
        }
        return $this->vgroups;
    }
    private function getDistinctServices( $vgid, $needcalc ) {
        return yii::app()->controller->lanbilling->getRows('getVgroupServices', array( 'flt' => array(
            'vgid' => $vgid,
            'common' => 1,
            'unavail' => -1,
            'needcalc' => $needcalc, 
            'defaultonly' => 1
        )));
    }
    private function addAppKeyAndDownloadUrl( $service ) {
        $externaldata = $service->service->externaldata;
        $externaldata = explode( '#', $externaldata );
        $service->key = $externaldata[0];
        $service->url = $externaldata[1];
        return $service;
    }
    public function getServicesGridHTML($params) {
        $html = "";
        $title = $params["title"];
        $dataGetter = $params["dataGetter"];
        $gridComponent = $params["gridComponent"];
        $gridComponent = yii::app()->controller->getModule()->$gridComponent;
        foreach ( $this->$dataGetter() as $id => $vgroup ) {
            $gridComponent->setVGBlocked($vgroup["blocked"]);
            $gridComponent->setID(md5($params["gridComponent"] . $id));
            $gridComponent->ClearData();
            $gridComponent->setTitle( yii::t("antivirus", $title) . " (" . $vgroup["login"] . ")" );
            $gridComponent->setServices($vgroup["services"]);
            $html .= $gridComponent->Render();
        }
        if (!$html) {
            $gridComponent->setTitle( yii::t("antivirus", $title) );
            return $gridComponent->Render();
        }
        return $html;
    }
    private function getAssignedServices( $vgid ) {
    
        $result = array();
        $services = yii::app()->controller->lanbilling->getRows( 'getUsboxServices', array(
            "flt" => array(
                        "dtfrom" => yii::app()->controller->lanbilling->subDate('now', 0, 'day', 'Y-m-d H:i:s'),
                        "dtto" => "9999-12-31 23:59:59",
                        "common" => 1,
                        "tarid" => 0,
                        "category" => -1,
                        "needcalc" => 1,
                        "vgid" => $vgid,
                )
        ));
        foreach( $services as $v ) {
            $v->service = $this->addLinkAndDescrFull($v->service);
            if ($v->service->available) {
                $result[] = $this->addAppKeyAndDownloadUrl($v);
            }
        }
        return $result;

    }
    private function getTarCategory( $tarid, $catidx ) {
        if( !$this->tariffCategories[$tarid] ) {
            $this->tariffCategories[$tarid] = yii::app()->controller->lanbilling->getRows(
                "getTarCategories", array( "id" => $tarid )
            );
        }
        foreach ( $this->tariffCategories[$tarid] as $c ) {
            if ( $c->catidx == $catidx ) return $c;
        }
        throw new Exception( "Category not found" );
    }
    private function addLinkAndDescrFull($service) {
        $categoryData = $this->getTarCategory( $service->tarid, $service->catidx );
        $service->link = $categoryData->link;
        $service->descrfull = $categoryData->descrfull;
        $service->available = $categoryData->available;
        return $service;
    }
    private function getAvailableServices( $vgid ) {        
        $result = array();
        $services = array_merge( $this->getDistinctServices($vgid, 1), $this->getDistinctServices($vgid, 0) );
        foreach ( $services as $v ) {
            if ($v->available) {
                $result[] = $this->addLinkAndDescrFull($v);
            }
        }
        return $result;
    }
    public function getServicesListForGrid( $params ) {
        $prop = $params["prop"];
        $list = $params["list"];
        $validation = $params["validation"];
        $value = $this->$prop;
        if ( !$value ) {
            foreach ( $this->getVgroups() as $vgroup ) {
                foreach ( $this->$list($vgroup->vgid) as $service ) {
                    if ( $this->$validation($service) ) {
                        if ( !isset($value[$vgroup->vgid]) ) $value[$vgroup->vgid] = array(
                            "blocked" => $vgroup->blocked,
                            "login" => $vgroup->login,
                            "services" => array()
                        );
                        $value[$vgroup->vgid]["services"][] = $service;
                    }
                }
                $this->$prop = $value;
            }
        }
        return $value;

    }
    public function getAssignedAntivirusServices() {
         
        return $this->getServicesListForGrid(array(
            "prop" => "assignedAntivirusServices",
            "list" => "getAssignedServices",
            "validation" => "isAssignedAntivirusService"
        ));
    
    }
    public function isAssignedAntivirusService( $service ) {
        foreach ($this->getAvailableAntivirusServices() as $vgroup) {
            foreach ($vgroup["services"] as $serv) {
                if ($serv->tarid == $service->service->tarid AND $serv->catidx == $service->service->catidx) return true;
            }
        }
        return false;
    }
    public function getAvailableAntivirusServices() {
        
        $result = $this->getServicesListForGrid(array(
            "prop" => "availableAntivirusServices",
            "list" => "getAvailableServices",
            "validation" => "isAvailableAntivirusService"
        ));

        if (!$result) throw new Exception( yii::t( self::getLocalizeFileName(), "NoAntivirusServices" ) );
        return $result;
    
    }

    public function assignService( $vgid, $catidx ) {
        $vg = yii::app()->controller->lanbilling->getItem('getClientVgroups',array('flt' => array('vgid' => $vgid)));
        if ($vg->vgroup->blocked) {
            return false;
        }
        $struct = array(
            "servid"    =>  0,
            "vgid"      =>  (int) $vgid,
            "tarid"     =>  $vg->vgroup->tarifid,
            "catidx"    =>  $catidx,
            "mul"       =>  1,
            'common' => 1,
            "timefrom"  =>  yii::app()->controller->lanbilling->subDate('now', 0, 'day', 'Y-m-d 00:00:00'),
            "timeto" => $this->getServiceTimeto(),
            'rate' => 1,
            //"externaldata" => uniqid()
        );
        $success = yii::app()->controller->lanbilling->save( "insupdClientUsboxService", $struct , true );
        return $success;
    }

    public function stopService( $servid, $vgid ) {
        $vg = yii::app()->controller->lanbilling->getItem('getClientVgroups',array('flt' => array('vgid' => $vgid)));
        if ($vg->vgroup->blocked) {
            return false;
        }
        $struct = array(
                "id" => $servid,
                    "timeto" => ""
            );  
        $success = yii::app()->controller->lanbilling->get( "stopUsboxService", $struct, false );
        return $success;
    }

    public function getCategoryData( $vgid, $catidx ) {
        $vg = yii::app()->controller->lanbilling->getItem('getClientVgroups',array('flt' => array('vgid' => $vgid)));
        return $this->getTarCategory( $vg->vgroup->tarifid, $catidx );
    }
    
    public function getServiceData( $servid, $vgid, $tarid, $catidx ) { 
        $services = yii::app()->controller->lanbilling->getRows( 'getUsboxServices', array(
            "flt" => array(
                "dtfrom" => yii::app()->controller->lanbilling->subDate('now', 0, 'day', 'Y-m-d H:i:s'),
                "dtto" => "9999-12-31 23:59:59",
                "common" => 1,
                "tarid" => $tarid,
                "category" => -1,
                "needcalc" => 1,
                "vgid" => $vgid,
                "servid" => $servid
            )
        ));
        foreach ( $services as $service ) {
            if ( $service->service->servid == $servid ) return $service;
        }       
        throw new Exception( "Service not found" );
        return $services;

    }
    
} ?>
