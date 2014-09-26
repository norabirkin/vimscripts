<?php
class IPCatalog extends Catalog {
    
    protected $type = 1;
    protected $api = array(
        "del" => "delCatalogZoneIP",
        "get" => "getCatalogZonesIP",
        "set" => "setCatalogZoneIP",
        'tarCategory' => array(
            'method' => 'getTarCategoryZonesIP',
            'params' => array(
            )
        )
    );
    
    protected $attributes = array(
        "zone_id" => array(
            "type" => "int"
        ),
        "zone_ip" => array(
            "type" => "string",
            "filter" => true
        ),
        "zone_mask" => array(
            "type" => "string",
            "export" => "GetPrefixSizeByIPMask",
            "import" => "GetIPMaskByPrefixSize",
            "filter" => true
        ),
        "port" => array(
            "type" => "int",
            "filter" => true
        ),
        "proto" => array(
            "type" => "int",
            "filter" => true
        ),
        "descr" => array(
            "type" => "string",
            "filter" => true
        )
    );
    
    public function rowProcess( $row ) {
        $row["prefix_size"] = $this->GetPrefixSizeByIPMask( $row["zone_mask"] );
        return $row;
    }
    
    public function beforeSave( $params ) {
        if (yii::app()->controller->param("prefix_size", null) !== null) {
            $params["zone_mask"] = $this->GetIPMaskByPrefixSize( yii::app()->controller->param("prefix_size") );
        }
        return $params;
    }
    
    public function GetIPMaskByPrefixSize( $prefixSize ) {

        $correspondence = array_flip($this->GetPrefixSizeAndIPMaskCorrespondence());
        return $correspondence[ (int) $prefixSize ];
        
    }
    
    public function GetPrefixSizeByIPMask( $mask ) {
        
        $correspondence = $this->GetPrefixSizeAndIPMaskCorrespondence();
        return $correspondence[ $mask ];
        
    }
    
    protected function GetPrefixSizeAndIPMaskCorrespondence() {
        
        return array (
            '0.0.0.0' => 0,
            '128.0.0.0' => 1,
            '192.0.0.0' => 2,
            '224.0.0.0' => 3,
            '240.0.0.0' => 4,
            '248.0.0.0' => 5,
            '252.0.0.0' => 6,
            '254.0.0.0' => 7,
            '255.0.0.0' => 8,
            '255.128.0.0' => 9,
            '255.192.0.0' => 10,
            '255.224.0.0' => 11,
            '255.240.0.0' => 12,
            '255.248.0.0' => 13,
            '255.252.0.0' => 14,
            '255.254.0.0' => 15,
            '255.255.0.0' => 16,
            '255.255.128.0' => 17,
            '255.255.192.0' => 18,
            '255.255.224.0' => 19,
            '255.255.240.0' => 20,
            '255.255.248.0' => 21,
            '255.255.252.0' => 22,
            '255.255.254.0' => 23,
            '255.255.255.0' => 24,
            '255.255.255.128' => 25,
            '255.255.255.192' => 26,
            '255.255.255.224' => 27,
            '255.255.255.240' => 28,
            '255.255.255.248' => 29,
            '255.255.255.252' => 30,
            '255.255.255.254' => 31,
            '255.255.255.255' => 32
        );
        
    }
    
} ?>
