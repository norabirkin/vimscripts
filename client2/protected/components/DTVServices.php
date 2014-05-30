<?php class DTVServices {
    private static $instance;
    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new self;
        }
        return self::$instance;
    }
    public function ServiceIsPackage($service) {
        if (!$this->ModuleHasPackagesPHPConfig()) return $service->dtvtype == 1;
        return $this->IsDTVVgroup($service->vgid) AND in_array($service->uuid, $this->GetModule()->packages);
    }
    public function ServiceIsChannel($service) {
        if (!$this->ModuleHasPackagesPHPConfig()) return $service->dtvtype == 2;
        return $this->IsDTVVgroup($service->vgid) AND $this->ServiceHasUUIdDParam($service) AND !$this->ServiceIsPackage($service);
    }
    private function IsDTVVgroup($vgid) {
        return in_array($vgid, array_keys(yii::app()->getModule('DTV')->SmartCardTabs->getVgroups()));
    }
    private function ServiceHasUUIdDParam($service) {
        return !empty($service->uuid);
    }
    private function GetModule() {
        return yii::app()->getModule('DTV');
    }
    private function ModuleHasPackagesPHPConfig() {
        if ( $this->GetModule()->packages === null OR !is_array($this->GetModule()->packages) ) return false;
        else return true;
    }
} ?>
