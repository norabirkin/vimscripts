<?php
/**
 * Component to get system options from API
 */

class Option extends CApplicationComponent {
    /**
     * Options from API
     * @var Array
     */
    private $_options = array();
    
    
    /**
     * Load options from API
     * 
     */
    private function loadOptions() {
        $buff = Yii::app()->japi->callAndSend('getOptions');
        
        foreach($buff as $item) {
            if(!isset($item['name'])) {
                continue;
            }
            $this->_options[ $item['name'] ] = $item;
        }
        
        return $this->_options;
    }
    
    
    /**
     * Get all options from API
     * 
     */
    public function getAllAssoc() {
        return $this->loadOptions();
    }
    
    
    /**
     * Get Option value
     * 
     * @param $name    String Option name
     * @param $default String Option value
     */
    public function getValue($name, $default = NULL) {
        $option;
        
        if(!($option = $this->getOption($name))) {
            return $default;
        }
        
        return $option['value'];
    }
    
    
    /**
     * Get Option description
     * 
     * @param $name    String Option name
     * @param $default String Option description
     */
    public function getDescription($name, $default = NULL) {
        $option;
        
        if(!($option = $this->getOption($name))) {
            return $default;
        }
        
        return $option['descr'];
    }
    
    
    /**
     * Get option item by name
     * 
     * @param $name    String Option name
     */
    private function getOption($name) {
        if(!$name) {
            return false;
        }
        
        if(!isset($this->_options[ $name ])) {
            $this->loadOptions();
        }
        
        if(isset($this->_options[ $name ])) {
            return $this->_options[ $name ];
        }
        
        return NULL;
    }
    
    
    /**
     * Set option value
     * 
     * @param $name        String  Option name
     * @param $value       String  Option value
     * @param $description String  Option description
     */
    public function setOption($name, $value, $description = NULL) {
        if(!$name) {
            return false;
        }
        if ($name == 'lock_period') {
            return $this->setClosingPeriodDate($value);
        }
        
        $curr_option = $this->getOption($name);
        
        $this->_options[ $name ] = array(
            'name' => $name,
            'descr' => !is_null($description) ? $description : ($curr_option ? $curr_option['descr'] : ''),
            'value' => $value
        );
        
        return Yii::app()->japi->callAndSend("setOption", $this->_options[ $name ]);
    }

    private function setClosingPeriodDate($value) {
        return yii::app()->japi->callAndSend('setOpenPeriodBeginDate', array(
            'date' => $value
        ));
    }
}

?>
