<?php
class SettingsController extends Controller {
    /**
     * Options config file
     * @var string
     */
    private $optionFile;
    
    /**
     * Options store
     * @var array
     */
    private $options = array();
    
    /**
     * 
     */
    private $optionsMap = array();
    
    
    /**
     * Initialize controller properties
     * 
     */
    public function init() {
        // Initialize parent
        parent::init();
        
        Yii::import('application.components.Options.Group');
    }
    
    
    /**
     * Read options from file and apply them to JAPI response
     */
    private function initOptions( $groups = array() ) {
        $options = Yii::app()->options->getAllAssoc('getOptions');
        
        if (!isset($options['export_character'])) {
            $options['export_character'] = array(
                "name" => "export_character",
                "descr" =>  '',
                "time_mark" =>  '',
                "value" =>  "UTF-8"
            );
        }
        if (!isset($options['session_lifetime'])) {
            $options['session_lifetime'] = array(
                "name" => "session_lifetime",
                "descr" =>  '',
                "time_mark" =>  '',
                "value" =>  "0"
            );
        }
        if (!isset($options['disable_change_user_agreement'])) {
            $options['disable_change_user_agreement'] = array(
                "name" => "disable_change_user_agreement",
                "descr" =>  '',
                "time_mark" =>  '',
                "value" =>  "0"
            );
        }
        if (!isset($options['payments_cash_now'])) {
            $options['payments_cash_now'] = array(
                "name" => "payments_cash_now",
                "descr" =>  '',
                "time_mark" =>  '',
                "value" =>  "0"
            );
        }
        
        $config = require_once( Group::getConfigFile() );
        
        foreach($config as $group) {
            if(!isset($group['idx'])) {
                continue;
            }
            
            if(!is_null($groups) && false === in_array($group['idx'], $groups)) {
                continue;
            }
            
            $group = new Group($group, $options);
            $this->options[ $group->getIdx() ] = $group;
            $this->optionsMap = array_merge($this->optionsMap, $group->getMap());
        }
    }
    
    
    public function getGroups( $groups = "" ) {
        $groups = explode(',', $groups);
        
        if(empty($groups)) {
            return array();
        }
        
        $groups = array_unique($groups);
        $this->initOptions($groups);
        $groups = array_flip($groups);
        $groups = array_intersect_key($this->options, $groups);
        
        return is_array($groups) ? $groups : array( $groups );
    }
    
    
    public function getGroupsValues( $groups = "" ) {
        $result = array();
        
        $groups = $this->getGroups($groups);
        
        if(empty($groups)) {
            return $result;
        }
        
        foreach($groups as $group) {
            $result = array_merge($result, $group->getOptions());
        }
        
        return $result;
    }
    
    public function actionList() {
        $this->success( $this->getGroupsValues( $this->param('group', '')) );
    }
    
    public function actionUpdate() {
        $name = $this->param("name", "");
        $descr = $this->param("descr", NULL);
        $value = (string)$this->param("value", "");
        
        $result = Yii::app()->options->setOption($name, $value, $descr);
        
        $this->success($result);
    }

    public function actionSavePaymentOptions() {

        Yii::app()->options->setOption("cyberplat_agreement_regex", $this->param("cyberplat_agreement_regex"), "");
        Yii::app()->options->setOption("option_tax_value", $this->param("option_tax_value"), "");
        Yii::app()->options->setOption("pay_import", $this->param("pay_import"), "");
        Yii::app()->options->setOption("payment_format", $this->param("payment_format"), "");
        Yii::app()->options->setOption("payment_script_path", $this->param("payment_script_path"), "");
        Yii::app()->options->setOption("print_sales_ocfiz", $this->param("print_sales_ocfiz"), "");
        Yii::app()->options->setOption("print_sales_ocur", $this->param("print_sales_ocur"), "");
        Yii::app()->options->setOption("print_sales_template", $this->param("print_sales_template"), "");
        Yii::app()->options->setOption("print_sales_mebius", $this->param("print_sales_mebius"), "");
        Yii::app()->options->setOption("payments_cash_now", $this->param("payments_cash_now"), "");

        $this->success(true);
    }
    
    public function actionGroups() {
        $this->success( $this->options->getGroupsList() );
    }
    
    public function actionGet() {
        $option = yii::app()->japi->callAndSend("getOption", array( "name" => $this->param("name") ));
        $this->success($option["value"]);
    }
    
    public function actionCountries() {
        $countries = require_once(Group::getCountriesConfigFile());
        $this->success( $countries );
    }    
}
?>
