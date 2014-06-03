<?php class Statistics extends EventList {
	public $date = array();
    public $vgid;
    public $login;
	public static $types = array(
    	'base' => array(
			'class' => 'BaseStatistics'
		),
        'rent' => array(
        	'class' => 'RentStatistics',
            'tarif_types' => array(0,1,2,3,4),
            'scope' => 'vgroups'
        ),
        'service' => array(
        	'class' => 'ServiceStatistics',
            'tarif_types' => array(5),
            'scope' => 'vgroups'
        ),
        'tarif' => array(
        	'class' => 'TarifStatistics',
            'tarif_types' => array(0,1,2,3,4,5),
            'scope' => 'vgroups'
        ),
        'traffic' => array(
        	'class' => 'TrafficStatistics',
            'tarif_types' => array(0,1,2),
            'scope' => 'vgroups'
        ),
        'block' => array(
        	'class' => 'BlockStatistics',
            'tarif_types' => array(0,1,2,3,4,5),
            'scope' => 'vgroups'
        ),
        'payment' => array(
        	'class' => 'PaymentStatistics',
            'tarif_types' => array(0,1,2,3,4,5),
            'scope' => 'agreements'
        ),
        'phone' => array(
			'class' => 'PhoneStatistics',
            'tarif_types' => array(3,4),
            'scope' => 'vgroups'
		)
    );
    public static function type($type) {
        if (!isset(self::$types[$type])) return false;
        yii::import('application.models.Statistics.*');
        $classname = self::$types[$type]['class'];
        return new $classname;
    }
    public function rules() {
        return array();
    }
}
