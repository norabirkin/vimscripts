<?php
class RolestestController extends Controller {

    public function actionRw() {
        $this->fakeRequest( "rw" );
        $this->success( yii::app()->japi->callAndSend( "someMethod", array(
            "param1" => "val1",
            "param2" => "val2"                  
        )));
    }

    public function actionRo() {
        $this->fakeRequest( "ro" ); 
        $this->success( yii::app()->japi->callAndSend( "someMethod", array(
            "param1" => "val1",
            "param2" => "val2"                  
        )));
    }

    public function actionHide() {
        $this->fakeRequest();
        $this->success( yii::app()->japi->callAndSend( "someMethod", array(
            "param1" => "val1",
            "param2" => "val2"                  
        )));
    }

    public function actionNoapirequest() {
        $this->success( "Hello world" );
    }
    
    public function actionError() {
        $this->fakeRequest( "rw", true );
        $this->success( yii::app()->japi->callAndSend( "someMethod", array(
            "param1" => "val1",
            "param2" => "val2"                  
        )));
    }

    private function fakeRequest( $perms = null, $error = false ) {
        $role = array( "DESCR:rw" );
        if ($perms) {
            $role[] = "NAME:" . $perms;
        }
        $response = FResponse::get()->result(array(
            "session_id" => JAPIMocker::SESSID,
            "authenticated" => 1,
            "rights" => $role 
        ));
        if ($error) {
            $response = $response->error();
        } else {
            $response = $response->result(array(
                "category" => 6,
                "uid" => 77,
                "title" => "Something"
            ));
        }

        yii::app()->japi->useFake();
        yii::app()->japi->fakeConnection(
            
            FRequest::get()
            ->auth()
            ->call( "someMethod", array(
                "param1" => "val1",
                "param2" => "val2"                  
            )),

            $response
        );
    }

}?>
