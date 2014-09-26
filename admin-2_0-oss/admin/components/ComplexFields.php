<?php

class ComplexFields {
    private $fields = array();
    public function add($result, $items) {
        foreach ($items as $item) {
            $id = $result[$item['id']]; 
            if ($id) {
                $this->fields[$item['key']] = yii::app()->japi->call(
                    $item['method'],
                    $item['params']($id)
                );
                unset($result[$item['id']]);
            }
        }
        return $this->result($result);
    }
    private function result($result) {
        if ($this->fields) {
            yii::app()->japi->send(true);
            foreach ($this->fields as $k => $v) {
                if ($data = $v->getResult()) {
                    if (isset($data[0])) {
                        if (isset($data[1])) {
                            throw new CHtmlException(500, 'Data is not found');
                        }
                        $data = $data[0];
                    }
                    $result[$k] = CJSON::encode($data);
                }
            }
        }
        return $result;
    }
    public function serviceCode() {
        return array(
            'id' => 'sale_dictionary_id',
            'key' => 'service_code',
            'method' => 'getSaleDictionaryEntries',
            'params' => function($id) {
                return array(
                    'record_id' => $id
                );
            }
        );
    }
}

?>
