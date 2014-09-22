<?php

class DbConnection extends CDbConnection {
    public function __construct($dsn='',$username='',$password='') {
        $this->driverMap['sqlite'] = 'SqliteSchema';
        parent::__construct($dsn,$username,$password);
    }
}

?>
