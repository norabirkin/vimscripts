<?php
class Roles {
    
    public function getMacroRole( $id ) {
        
        $microroles = yii::app()->japi->call( "getMicroRoles" );
        $macrorole = yii::app()->japi->call( "getMacroRole", array( 
            "macrorole_id" => $id
        ));
        yii::app()->japi->send();       
        return $this->addMicroRolesDetails( $macrorole, $microroles );
        
    }
    
    public function addMicroRolesDetails( $macrorole, $microroles ) {
        
        $microroles = $this->transformMicroRolesObject( $microroles );
        $macrorole = $macrorole->getBody();
        $microrole_ids = array();
        foreach ($macrorole["microroles"] as $k => $v) {
            $macrorole["microroles"][$k] = $microroles[$v];
            $microrole_ids[] = $microroles[$v]["id"];
        }
        return $this->addMicroRolesObjects( $microrole_ids, $macrorole );
        
    }
    
    public function addMicroRolesObjects( $microrole_ids, $macrorole ) {
        
        $microrole_objects = array();
        
        foreach ($microrole_ids as $id) {
            $microrole_objects[ $id ] = yii::app()->japi->call( "getMicroRoleDetails", array(
                "microrole_id" => $id,
                "macrorole_id" => $macrorole["id"]
            ));         
        }
        yii::app()->japi->send();
        
        foreach ($macrorole["microroles"] as $k => $v) {
            $objects = $microrole_objects[ $macrorole["microroles"][$k]["id"] ]->getBody();
            if ($objects) {
                $macrorole["microroles"][$k]["details"] = $microrole_objects[ $macrorole["microroles"][$k]["id"] ]->getBody();
            }
        }
        
        return $macrorole;
        
    }
    
    public function transformMicroRolesObject( $microroles ) {
        
        $result = array();
        foreach ($microroles->getBody() as $item) {
            $result[ $item["id"] ] = $item;
        }
        return $result;
        
    }
    
    public function fake() {
        
        yii::app()->japi->useFake();
        yii::app()->japi->fakeConnection(
            
            FRequest::get()
            ->auth()
            ->call("getMicroRoles")
            ->call("getMacroRole", array(
                "macrorole_id" => 6
            )),
            
            FResponse::get()
            ->auth()
            ->result(array(
                array(
                    "id" => 1,
                    "name" => "VG",
                    "description" => "Учетная запись"
                ),
                array(
                    "id" => 2,
                    "name" => "TAR",
                    "description" => "Тарифы"
                ),
                array(
                    "id" => 3,
                    "name" => "PROMO",
                    "description" => "Акции"
                )
            ))
            ->result(array(
                    "id" => 6,
                    "name" => "Продвинутый кассир",
                    "description" => "Очень непростой кассир",
                    "microroles" => array( 1, 2, 3 )
            ))
        
        );
        
        yii::app()->japi->fakeConnection(
            
            FRequest::get()
            ->auth()
            ->call("getMicroRoleDetails", array(
                "microrole_id" => 1,
                "macrorole_id" => 6
            ))
            ->call("getMicroRoleDetails", array(
                "microrole_id" => 2,
                "macrorole_id" => 6
            ))
            ->call("getMicroRoleDetails", array(
                "microrole_id" => 3,
                "macrorole_id" => 6
            )),
            
            FResponse::get()
            ->auth()
            ->result(array(
                "perms" => "ro", 
                "objects" => array( 536, 356, 744 )
            ))
            ->result(array( 
                "perms" => "rw", 
                array( 693, 34, 963, 4986 ) 
            ))
            ->result(array( ))
        
        );
        
    }
    
} ?>
