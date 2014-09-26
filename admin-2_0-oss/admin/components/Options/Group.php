<?php

class Group {
    /**
     * 
     */
    private $idx;
    
    /**
     * 
     */
    private $descr;
    
    /**
     * 
     */
    private $options = array();
    
    
    /**
     * Constructor
     */
    public function __construct($group = array(), $options = array()) {
        $diff = array(
            'idx' => null,
            'descr' => null
        );
        
        $props = array_intersect_key($group, $diff);
        $group = array_diff_key($group, $diff);
        
        if(isset($props['idx'])) {
            $this->idx = $props['idx'];
        }
        
        if(isset($props['descr'])) {
            $this->descr = $props['descr'];
        }
        
        $group = is_array($group) ? $group : array($group);
        
        foreach($group as $key => $item) {
            if(!is_array($item)) {
                continue;
            }
            
            $option = array_intersect_ukey($options, array_flip( array( $item['name'] ) ), "self::findOptionKey");
            
            if(!empty($option)) {
                $option = array_values($option);
                $option = $option[0];
            }
            
            if($option) {
                $descr = isset($item['descr']) && !empty($item['descr']) ? 
                           $item['descr'] : $option['descr'];
                
                $type = isset($item['type']) ? 
                            $item['type'] : 'text';
                    
                $this->options[ $item['name'] ] = array(
                    'gid' => $this->idx,
                    'gdescr' => Yii::t( 'messages', $this->descr ),
                    'name' => $option['name'],
                    'descr' => Yii::t( 'messages', $descr ? $descr : 'Undefined'),
                    'type' => $type,
                    'value' => $option['value'],
                    'valuedescr' => $this->getValueDescr( 
                        isset($item['valuedescr']) ? $item['valuedescr'] : '',
                        array(
                            $option['value']
                        )
                    )
                );
            }
        }
        
        return $this;
    }
    
    
    private function findOptionKey( $key = '', $compare = '' ) {
        if(strpos($compare, '/') === 0) {
            return preg_match($compare, $key) > 0 ? 0 : -1;
        }
        
        if($key == $compare) {
            return 0;
        }
        
        return -1;
    }
    
    
    /**
     * 
     */
    private function getValueDescr( $method = '', $params = array() ) {
        if(empty($method)) {
            return '';
        }
        
        if (!method_exists( $this, $method )) {
            return '';
        }
        
        return call_user_func_array(array($this, $method), $params);
    }
    
    
    /**
     * 
     */
    private function getAccount( $uid = 0 ) {
        if((int)$uid <= 0) {
            return '';
        }
        
        $operator = Yii::app()->japi->callAndSend(
            "getAccounts", 
            array( 
                "category" => 1, 
                "uid" => (int) $uid
            )
        );
        
        return $operator[0]["name"];
    }
    
    /**
     * 
     */
    private function getExporCharacter( $charset = '' ) {
        return $charset;
    }
    
    
    /**
     * 
     */
    private function getDocuments( $docid = 0 ) {
        if((int)$docid <= 0) {
            return '';
        }
        
        $operator = Yii::app()->japi->callAndSend(
            "getDocuments", 
            array( 
                "doc_id" => (int) $docid
            )
        );
        
        return $operator[0]["name"];
    }
    
    
    /**
     * 
     */
    private function getCountry( $id = 0 ) {
        if((int)$id == 0) {
            return '';
        }
        
        $countries = require_once(Group::getCountriesConfigFile());
        
        foreach($countries as $item) {
            if($item['recordid'] == $id) {
                return $item['name'];
            }
        }
    }
    
    /**
     * 
     */
    public function getOption( $name = null) {
        if(is_null($name)) {
            return null;
        }
        
        if(isset($this->options[$name])) {
            return $this->options[$name];
        }
    }
    
    
    /**
     * 
     */
    public function getOptions() {
        return array_values($this->options);
    }
    
    
    /**
     * 
     */
    public function getAssocOptions() {
        return $this->options;
    }
    
    
    /**
     * 
     */
    public function getIdx() {
        return $this->idx;
    }
    
    
    /**
     * 
     */
    public function getMap() {
        $result = array();
        $options = array_keys($this->options);
        
        if(empty($options)) {
            return $result;
        }
        
        return array_combine(
            array_keys($options), 
            array_pad(array(), count($options), $this->idx)
        );
    }
    
    
    /**
     * 
     */
    static function getConfigFile() {
        return dirname(__FILE__) . DIRECTORY_SEPARATOR . "config/options.php";
    }
    
    
    /**
     * 
     */
    static function getCountriesConfigFile() {
        return dirname(__FILE__) . DIRECTORY_SEPARATOR . "config/countries.php";
    }
}
?>
