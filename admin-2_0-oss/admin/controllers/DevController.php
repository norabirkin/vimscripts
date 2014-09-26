<?php
class DevController extends CController {
    
    private $login = 'admin';
    private $password = '';
    
    public function error( $error ) {
        Dumper::dump( $error );
    }

    private function options() {
        $options = new Options( array() );
        $config = $options->getConfig();
        yii::import("application.tests.helpers.ArrayPrinter");
        $ap = new ArrayPrinter;
        $result = array();
        foreach ($config as $group => $options) {
            $opts = array();
            if (is_array($options)) {
                foreach ($options as $opt) {
                    $o = array(
                        "name" => $opt,
                        "type" => "text"
                    );
                    $opts[] = $o;
                }
                $result[ $group ] = $opts;
            }
        }
        $a = $ap->run( $result );
        Dumper::log( $a );
    }
    
    private function managers() {
        
        yii::app()->japi->call('LoginSession', array(
            "manager" => "admin",
            "password" => ""
        ));
        
        $response = yii::app()->japi->call('getManagers', array(
            "parentid" => 15
        ));
        
        yii::app()->japi->send();
         
        Dumper::dump( $response->getBody() );
        
    }
    
    private function api() {
        yii::app()->japi->call('LoginSession', array(
            "manager" => "admin",
            "password" => ""
        ));
        $vgroup = yii::app()->japi->call('getVgroupExt', array(
            'vg_id' => 1163
        ));
        yii::app()->japi->send();
        Dumper::dump($vgroup->getResult());
    }
    
    private function requests() {
        $this->get("/api/documentsqueue");
    }
    
    private function get($route, $params = array()) {
        
        $response = yii::app()->rest->get($route, $params);
        Dumper::dump($response);
        
    }
    
    private function post($route, $params) {
        
        $response = yii::app()->rest->post($route, $params);
        Dumper::dump($response);
        
    }
    
    private function put($route, $params) {
        
        $response = yii::app()->rest->put($route, $params);
        Dumper::dump($response);
        
    }
    
    private function delete($route, $params) {
        
        $response = yii::app()->rest->delete($route, $params);
        Dumper::dump($response);
        
    }
    
    private function example() {
    
        yii::app()->japi->call('LoginSession', array(
            "manager" => "admin",
            "password" => ""
        ));
        
        $agents = yii::app()->japi->call('getAgent', array(
            "id" => 5
        ));
        
        $vgroups = yii::app()->japi->call('getVgroups', array(
            "vgid" => 1835
        ));
        
        $error = yii::app()->japi->call('someMethod', array(
            "vgid" => 1835
        ));
        
        yii::app()->japi->send();
        
        yii::app()->japi->useFake();
        yii::app()->japi->fakeConnection(
            
            FRequest::get()
            ->auth()
            ->call( "someMethod", array(
                "param1" => "val1",
                "param2" => "val2"                  
            ))
            ->call( "otherMethod", array(
                "someparam" => "someval"            
            )),
            
            FResponse::get()
            ->auth()
            ->result(array(
                "id" => 6,
                "name" => "item_name",
                "descr" => "item_descr"
            ))
            ->result(array(
                "category" => 6,
                "uid" => 77,
                "title" => "Something"
            ))
        );
        
        $fakeResult1 = yii::app()->japi->call("someMethod", array(
            "param1" => "val1",
            "param2" => "val2"                  
        ));
        
        $fakeResult2 = yii::app()->japi->call("otherMethod", array(
            "someparam" => "someval"            
        ));
        
        yii::app()->japi->send();
        
        yii::app()->japi->useReal();
        
        yii::app()->japi->call('LoginSession', array(
            "manager" => "admin",
            "password" => ""
        ));
        
        $tarcats = yii::app()->japi->call('getTarCategory', array(
            "tarid" => 1,
        ));
        
        yii::app()->japi->send();
        
        echo '<h1>[ERROR]</h1>';
        if ($error->isError()) {
            Dumper::dump( $error->getErrorMessage() );
        }
        
        echo '<h1>[AGENT]</h1>';
        if (!$agents->isError()) {
            Dumper::dump( $agents->getBody() );
        }
        
        echo '<h1>[VGROUP]</h1>';
        if (!$vgroups->isError()) {
            Dumper::dump( $vgroups->getBody() );
        }
        
        echo '<h1>[FAKE RESULT 1]</h1>';
        if (!$fakeResult1->isError()) {
            Dumper::dump( $fakeResult1->getBody() );
        }
        
        echo '<h1>[FAKE RESULT 2]</h1>';
        if (!$fakeResult2->isError()) {
            Dumper::dump( $fakeResult2->getBody() );
        }
        
        echo '<h1>[BACK TO REALITY]</h1>';
        if (!$tarcats->isError()) {
            Dumper::dump( $tarcats->getBody() );
        }
    }
    
    public function actionApi() {
        
        $response = yii::app()->japi->call('system_get_functors');
        yii::app()->japi->send();
        VarDumper::dump($response->getBody(), 10, true);
        
    }
    
    public function actionRoutes() {
        
        $RoutesDescription = new RoutesDescription;
        $RoutesDescription->run();
        
    }
    
    public function sendResponse($code, $data) {
        
    }
    
    public function auth() {
        yii::app()->rest->get('/api/login/logout');
        yii::app()->rest->post('/api/login/authorize', array(
            'login' => $this->login, 
            'password' => $this->password
        ));
    }
    
    public function prefixSizeToMask( $mask ) {
        return long2ip(pow(2,32) - pow(2, (32-$mask)));
    }

    public function ipVsNet( $ip, $mask, $network ) {
        if (((ip2long($ip))&(ip2long($mask)))==ip2long($network)) {
            return 1;
        }
        return 0;
    }

    public function getNetworkByIPAndPrefixSize( $ip, $prefixSize ) {
        return ip2long($ip) & ip2long($this->prefixSizeToMask($prefixSize));
    }

    private function format() {
        $paymentFormat = new PaymentFormat;
        $option = $paymentFormat->get();
        Dumper::dump( $option );
        if ($option["pordertpl"] == "[A-z0-9\\u0410-\\u044f]\\x7B2\\x7D-[A-z0-9\\u0410-\\u044f]\\x7B2\\x7D-[A-z0-9\\u0410-\\u044f]\\x7B2\\x7D-[0-9]\\x7B3\\x7D-[A-z0-9\\u0410-\\u044f]-[0-9]-P77") {
            echo "<h1>SUCCESS</h1>";
        } else {
            echo "<h1>FAIL</h1>";
        }
    }

    public function actionIndex() {
        echo '<meta charset="utf-8">';
        $this->auth();
        $this->requests();
        //$this->api();
    
    }
    
} ?>
