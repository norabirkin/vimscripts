<?php class ServiceFunctionWidgetsMTS extends ServiceFunctionWidgets {
    private $vgroups;
    private $config;
    private function getVgroupsMtsBonus() {
        if ($this->vgroups === null) {
            $accVg = array();
            if( false != ($result = yii::app()->controller->lanbilling->get("getClientVgroups")) )
            {
                if(!empty($result))
                {
                    if(!is_array($result)) {
                        $result = array($result);
                    }
                    $accVg = array();
                    array_walk($result, create_function('&$val, $key, $_tmp', '
                            $vArr = array(0,1,2); // types
                            if (in_array($val->vgroup->tariftype, $vArr)){
                                $_tmp[0][] = $val->vgroup;
                            }
                        '), array(&$accVg)
                    );
                }
            }
            $this->vgroups = $accVg;
        }
        return $this->vgroups;
    }
    private function getConfig($widget) {
        if (!$this->config) {
            $this->config = require_once(yii::getPathOfAlias(MainTemplateHelper::GetInstance()->GetTheme()->getPath().'.config.serviceFunctions').'.php');
        }
        return $this->config[$widget];
    }
    public function GetServiceFunctionWidget($savedfile) {
        if ($widget = parent::GetServiceFunctionWidget($savedfile)) {
            return $widget;
        }
        switch ($savedfile) {
            case 'iframe_mts_bonus' :
                return yii::app()->controller->widget(MainTemplateHelper::GetInstance()->GetTheme()->getPath().'.components.BonusWidget', array(
                    'vgroups' => $this->getVgroupsMtsBonus(),
                    'config' => $this->getConfig('mtsbonus')
                ) ,true);
                break;
            case 'iframe_mts_20off' :
                return yii::app()->controller->widget(MainTemplateHelper::GetInstance()->GetTheme()->getPath().'.components.mts20OffWidget', array(
                    'vgroups' => $this->getVgroupsMtsBonus(),
                    'config' => $this->getConfig('mts20off')
                ) ,true);
                break;
        }
        return '';
    }
} ?>
