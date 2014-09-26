<?php
class OSSListStatistics extends OSSList {

    protected function getFields() {
        return array(
            'pg_num' => 'pgnum',
            'pg_size' => 'pgsize'
        );
    }

    protected function totalRequest( $method, $params ) {
        return yii::app()->japi->call( $method, array_merge($params, array( "nodata" => true )) );
    }

} ?>
