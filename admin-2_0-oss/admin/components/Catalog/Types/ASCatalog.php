<?php
class ASCatalog extends Catalog {
    
    protected $type = 2;
    protected $api = array(
        "del" => "delCatalogZoneAS",
        "get" => "getCatalogZonesAS",
        "set" => "setCatalogZoneAS"
    );
    
    protected $attributes = array(
        "zone_id" => array(
            "type" => "int"
        ),
        "zone_as" => array(
            "type" => "int",
            "filter" => true
        ),
        "descr" => array(
            "type" => "string",
            "filter" => true
        )
    );
    
} ?>
