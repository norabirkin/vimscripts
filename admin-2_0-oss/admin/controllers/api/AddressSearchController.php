<?php
    
class AddressSearchController extends Controller{
    
    
    private function clearAddress( $address ) {
        $address = explode( ",", trim($address) );
        foreach ($address as $k => $v) {
            if ( !($address[$k] = trim($v)) ) { 
                unset($address[$k]); 
            }
        }
        $result = implode( ", ", $address );
        return $result;
    }
    
    
    public function actionList() {
        $params = array(
            'limit' => 15,
            'search' => $this->param('query')
        );
        $result = Yii::app()->japi->callAndSend("findFullAddress", $params);
        if(!is_array($result)) {
            $result = array($result);
        }

        $res = array();
        foreach($result as $item) {
            // prepair arrays
            $code = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            $name = array('','','','','','','','','','','');
            $meanings = array('','','','','','','','','','','');
            
            foreach($item as $data) {
                // fill code array
                $code[$data['type']] = $data['id'];
                $meanings[$data['type']] = $data['short'];
                
                
                if($data['short'] != '') {
                    $value =  $data['short'] . ' ' . $data['name'];
                } else {
                    $value = $data['name'];
                }                    
                
                // fill names array
                $name[$data['type']] = $value;

            }
            $res[] = array(
                'code' => implode(',', $code),
                'value' => $this->clearAddress(implode(',', $name)),
                'full_value' => implode(',', $name),
                'meanings' => implode(',', $meanings)
            );
        }
        $this->success($res);
    }
    
    
    public function actionMeanings() {
        $result = yii::app()->japi->callAndSend("getAddressMeanings", array(
            'level' => 0
        ));
        $this->success($result);
    }
    
    
    public function actionFindByCode() {
        $code = explode(',', $this->param('code'));
        $code = array_slice($code, 0, 10);
        $code = implode(',',$code);
        
        $result = yii::app()->japi->callAndSend("findAddressByCode", array(
            'code' => $code
        ));
        
        foreach($result as $item) {
            if($item['type'] == 6) {
                $build = yii::app()->japi->callAndSend("getAddressBuildings", array(
                    'record_id' => (int)$item['id']
                ));
                $record = array(
                    'id' => $build[0]['record_id'],
                    'type' => 10,
                    'name' => $build[0]['postcode']
                );
                
            }
        }
        $result[] = $record;
        
        $this->success($result);
                
    }
    
    
    public function actionApplyAddress() {
        $data = array('country', 'region', 'area', 'city', 'settle', 'street', 'building', 'flat', 'entrance', 'floor', 'postcode');
        $getMethod = array('getAddressCountries', 'getAddressRegions', 'getAddressAreas', 'getAddressCities', 'getAddressSettles', 
        'getAddressStreets', 'getAddressBuildings', 'getAddressFlats', 'getAddressEntrances', 'getAddressFloors');
        
        $codes = array();
        $names = array();
        
        $means = yii::app()->japi->callAndSend("getAddressMeanings", array(
            'level' => 0
        ));
        
        $meanings = array();        
        foreach($means as $mean) {    
            $meanings[$mean['record_id']] = $mean['short'];
        }
        
        foreach($data as $nk=>$name) {
            // define            
            $value = $this->param($name.'_id');
            $m_id = $this->param($name . '_meaning');
            $m_short = $meanings[$m_id];
            $edited = (int)$this->param($name . '_new');
            
    
                // Дополнительные проверки на существование введенных данных
                if($name != 'postcode') {
                    
                    $method = $getMethod[$nk];
                    $params = array(
                        'record_id' => (int)$value
                        );
                    
                    switch($name) {
                        case 'region':
                            $params['country_id'] = (int)$_POST['country_id'];
                        break;
                        case 'area':
                            $params['region_id'] = (int)$_POST['region_id'];
                        break;
                        case 'city':
                            $params['region_id'] = (int)$_POST['region_id'];
                            $params['area_id'] = (int)$_POST['area_id'];
                        break;
                        case 'settle':
                            $params['region_id'] = (int)$_POST['region_id'];
                            $params['area_id'] = (int)$_POST['area_id'];
                            $params['city_id'] = (int)$_POST['city_id'];
                        break;
                        case 'street':
                            $params['region_id'] = (int)$_POST['region_id'];
                            $params['settl_id'] = (int)$_POST['settle_id'];
                            $params['city_id'] = (int)$_POST['city_id'];
                        break;
                        case 'building':
                            $params['region_id'] = (int)$_POST['region_id'];
                            $params['settl_id'] = (int)$_POST['settle_id'];
                            $params['city_id'] = (int)$_POST['city_id'];
                            $params['settl_id'] = (int)$_POST['settle_id'];
                        break;
                        case 'flat':
                            $params['region_id'] = (int)$_POST['region_id'];
                            $params['building_id'] = (int)$_POST['building_id'];
                        break;
                        case 'entrance':
                            $params['region_id'] = (int)$_POST['region_id'];
                            $params['building_id'] = (int)$_POST['building_id'];
                        break;
                        case 'floor':
                            $params['region_id'] = (int)$_POST['region_id'];
                            $params['building_id'] = (int)$_POST['building_id'];
                        break;
                    }
                    
                    
                    $found = yii::app()->japi->callAndSend($method, $params);
                    
                    if(count($found)>0) {
                        if($found[0]['name'] == $value) {
                            $edited = 1;
                        }
                    } else {
                        if($value != 0) {
                            $edited = 1;
                            
                            if($name == 'building') {
                                $edited = (int)$this->param($name . '_new');
                            }
                        }
                    }
                    
                }
                
                /* else */

            if($edited > 0) {
                $_POST['name'] = $value;
                $_POST['short'] = $m_short;
                
                switch($name) {
                    case 'country': 
                        $_POST['country_id'] = $this->setAddressCountry();
                        $value = $_POST['country_id'];
                    break;
                    case 'region': 
                        $_POST['region_id'] = $this->setAddressRegion();
                        $value = $_POST['region_id'];
                    break;
                    case 'area': 
                        $_POST['area_id'] = $this->setAddressArea();
                        $value = $_POST['area_id'];
                    break;
                    case 'city':
                        $_POST['city_id'] = $this->setAddressCity();
                        $value = $_POST['city_id'];
                    break;
                    case 'settle':
                        $_POST['settle_id'] = $this->setAddressSettle();
                        $value = $_POST['settle_id'];
                    break;
                    case 'street':
                        $_POST['street_id'] = $this->setAddressStreet();
                        $value = $_POST['street_id'];
                    break;
                    case 'building':
                        $_POST['edit_building'] = ($edited == 2) ? 0 : (int)$_POST['building_id'];
                        $_POST['building_id'] = $this->setAddressBuilding();
                        $value = $_POST['building_id'];
                    break;
                    case 'flat':
                        $_POST['flat_id'] = $this->setAddressFlat();
                        $value = $_POST['flat_id'];
                    break;
                    case 'entrance':
                         $_POST['entrance_id'] = $this->setAddressEntrance();
                         $value = $_POST['entrance_id'];
                    break;
                    case 'floor':
                        $_POST['floor_id'] = $this->setAddressFloor();
                        $value = $_POST['floor_id'];
                    break;
                    case 'postcode':
                        $_POST['edit_building'] = (int)$_POST['building_id'];
                        $_POST['building_id'] = $this->setAddressBuilding();
                        $value = $_POST['building_id'];
                    break;
                }
            }

            //set values
            $codes[] = $value;

        }

        $res =  yii::app()->japi->callAndSend("findAddressByCode", array(
            'code' => implode(',', array_slice($codes, 0, 10))
            ));

       $this->success($res);
                
    }
    

    
    
    public function setAddressCountry() {
        if($this->isEmpty('name')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressCountry", array(
            "name" => $_POST["name"]
        ));
        return $result;
    }
    
    
    public function setAddressRegion() {
        if($this->isEmpty('name') || $this->isEmpty('country_id')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressRegion", array(
            "country_id" => (int) $_POST["country_id"],
            "name" => $_POST["name"],
            "short" => $_POST["short"]
        ));
        return $result;
    }
    
    
    
    
    public function setAddressArea() {
        if($this->isEmpty('name') || $this->isEmpty('region_id')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressArea", array(
            "name" => $_POST["name"],
            "region_id" => (int) $_POST["region_id"],
            "short" => $_POST["short"],
        ));
        return $result;
    }
    
    
    
    public function setAddressCity() {
        if($this->isEmpty('name') || $this->isEmpty('region_id')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressCity", array(
            'region_id' => (int) $_POST['region_id'],
            'area_id' => (int) $_POST['area_id'],
            "name" => $_POST["name"],
            "short" => $_POST["short"],
        ));
        return $result;
    }
    
    
    public function setAddressSettle() {
        if($this->isEmpty('name') || $this->isEmpty('region_id')) { 
            return 0;
        }
       $result =  yii::app()->japi->callAndSend("setAddressSettle", array(
            "name" => $_POST["name"],
            "short" => $_POST["short"],
            "area_id" => (int) $_POST["area_id"],
            "city_id" => (int) $_POST["city_id"],
            "region_id" => (int) $_POST["region_id"]
        ));
        return $result;
    }
    
    
    public function setAddressStreet() {
        if($this->isEmpty('name') || $this->isEmpty('region_id') || ($this->isEmpty('city_id') && $this->isEmpty('settl_id'))) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressStreet", array(
            "name" => $_POST["name"],
            "postcode" => (int) $_POST["postcode"],
            "short" => $_POST["short"],
            "city_id" => (int) $_POST["city_id"],
            "region_id" => (int) $_POST["region_id"],
            "settl_id" => (int) $_POST["settle_id"]
        ));
        return $result;
    }

    
    public function setAddressBuilding() {
        if($this->isEmpty('name') || $this->isEmpty('region_id')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressBuilding", array(
            'block' => $_POST['block'],
            'city_id' => (int) $_POST['city_id'],
            'record_id' => (int) $_POST['edit_building'],
            'conn_type' => (int) $_POST['conn_type'],
            'flats' => (int) $_POST['flats'],
            'name' => $_POST['name'],
            'postcode' => (int) $_POST['postcode'],
            'region_id' => (int) $_POST['region_id'],
            'settl_id' => (int) $_POST['settle_id'],
            'short' => $_POST['short'],
            'street_id' => (int) $_POST['street_id'],
            'construction' => $_POST['construction'],
            'ownership' => $_POST['ownership']
        ));
        return $result;
    }
    
    
    public function setAddressFlat() {
        if($this->isEmpty('name') || $this->isEmpty('building_id') || $this->isEmpty('region_id')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressFlat", array(
            'building_id' => (int) $_POST['building_id'],
            'name' => $_POST['name'],
            'record_id' => 0,
            'region_id' => (int) $_POST['region_id'],
            'short' => $_POST['short']
        ));
        return $result;
    }
    
    
    public function setAddressEntrance() {
        if($this->isEmpty('name') || $this->isEmpty('building_id') || $this->isEmpty('region_id')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressEntrance", array(
            'building_id' => (int) $_POST['building_id'],
            'name' => $_POST['name'],
            'record_id' => 0,
            'region_id' => (int) $_POST['region_id'],
            'short' => $_POST['short']
        ));
        return $result;
    }
    
    
    public function setAddressFloor() {
        if($this->isEmpty('name') || $this->isEmpty('building_id') || $this->isEmpty('region_id')) { 
            return 0;
        }
        $result = yii::app()->japi->callAndSend("setAddressFloor", array(
            'building_id' => (int) $_POST['building_id'],
            'name' => $_POST['name'],
            'record_id' => 0,
            'region_id' => (int) $_POST['region_id'],
            'short' => $_POST['short']
        ));
        return $result;
    }
    
    
    public function actionRemoveAddressElement() {
        $getMethod = array(
            'country' => 'delAddressCountry',
            'region' => 'delAddressRegion',
            'area' => 'delAddressArea',
            'city' => 'delAddressCity',
            'settle' => 'delAddressSettle',
            'street' => 'delAddressStreet',
            'building' => 'delAddressBuilding',
            'flat' => 'delAddressFlat',
            'entrance' => 'delAddressEntrance',
            'floor' => 'delAddressFloor'
        );
        
        $method = $getMethod[$this->param('item')];
        if($method == '') {
            $this->error();
        }
        
        $result = yii::app()->japi->callAndSend($method, array(
            'record_id' => (int)$this->param('record_id', 0)
        ));
        
        $this->success($result);
    }
    
    
    public function isEmpty($param) {
        if($_POST[$param] == '' || !$_POST[$param]) {
            return true;
        }
        return false;
    }
    
}
    
?>
