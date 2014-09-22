<?php

class SqliteSchema extends CSqliteSchema {
    private $ifNotExists = false;
    public function createTable($table, $columns, $options=null) {
        $this->ifNotExists = true;
        return parent::createTable($table, $columns, $options);
    }
    public function quoteColumnName($name) {
        $ifNotExists = $this->ifNotExists;
        $this->ifNotExists = false;
        $result = parent::quoteColumnName($name);
        $this->ifNotExists = $ifNotExists;
        return $result;
    }
    public function quoteTableName($name) {
        $result = (
            $this->ifNotExists ?
            'IF NOT EXISTS ' :
            ''
        ).parent::quoteTableName($name);
        $this->ifNotExists = false;
        return $result;
    }
}

?>
