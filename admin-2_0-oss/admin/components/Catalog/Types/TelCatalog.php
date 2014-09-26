<?php
class TelCatalog extends Catalog {
    
    protected $classes;
    protected $type = 3;
    protected $api = array(
        "del" => "delCatalogZoneTel",
        "get" => "getCatalogZonesTel",
        "set" => "setCatalogZoneTel",
        'tarCategory' => array(
            'method' => 'getTarCategoryZonesTel',
            'params' => array(
                'direction' => 'int'
            )
        )
    );
    
    protected $attributes = array(
        "zone_id" => array(
            "type" => "int"
        ),
        "zone_num" => array(
            "type" => "string",
            "filter" => true
        ),
        "class" => array(
            "type" => "int"
        ),
        "descr" => array(
            "type" => "string",
            "filter" => true
        )
    );
    
    function __construct( $config = null ) {
        parent::__construct( $config );
    }
    
} ?>
