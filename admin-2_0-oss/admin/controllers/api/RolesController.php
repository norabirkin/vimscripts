<?php
class RolesController  extends Controller {
    
    public function actionList() {
        $this->success( yii::app()->japi->callAndSend('getRoles') );
    }

    public function actionDelete() {
        $this->success( yii::app()->japi->callAndSend( 'delRole', array(
            "record_id" => (int) $this->getRequest()->getParam('record_id')
        )));
    }

    public function actionSave() { 
        $params = array(
            "record_id"                 => (int)$this->param("record_id"), 
            "name"                    => (string)$this->param("name"),
            "descr"                     => (string)$this->param("descr")
        );
        $this->success( yii::app()->japi->callAndSend('setRole', $params)); 
    }
         
    public function actionTariffsList () {
        $list = new OSSList(array(
            "useSort" => true
        ));
        
        $params = array(
            'pg_num' => (int)$this->param('pg_num'),
            'pg_size' => (int)$this->param('pg_size'),
            'role_id' =>(int)$this->param('role_id'),
            'un_used' => (bool)$this->param('un_used')
        );
        $result = $list->getList('getRoleTarifs', $params);
        
        $data = $result["result"]->getResult();
        $total = $result["total"]->getResult();
        
        foreach($data as $k=>$item) {
            $data[$k]['rights'] = $item['f_write'] ? 1 : 0;
        }
        
        $this->success( $data, $total );
    }
    
    
    public function actionAddTariffs () {
        $tarifs = explode(',', $this->param('tar_id'));

        foreach($tarifs as $tarif) {
            $params = array(
                'f_read' => (bool)true,
                'f_write' => (bool)false,
                'role_id' =>(int)$this->param('role_id'),
                'tar_id' => (int)$tarif
            );
            $result = yii::app()->japi->callAndSend('setRoleTarif', $params);
        }    
        
        $this->success();
    }
    
    
    public function actionChangeTariffRights () {
        $params = array(
            'f_read' => (bool)true,
            'f_write' => ((int)$this->param('rights') > 0) ? (bool)true : (bool)false,
            'role_id' =>(int)$this->param('role_id'),
            'tar_id' => (int)$this->param('tar_id')
        );
        $result = yii::app()->japi->callAndSend('setRoleTarif', $params);   
        
        $this->success();
    }
    
    
    public function actionRemoveTariffs () {
        $tarifs = explode(',', $this->param('tar_id'));

        foreach($tarifs as $tarif) {
            $params = array(
                'role_id' =>(int)$this->param('role_id'),
                'tar_id' => (int)$tarif
            );
            $result = yii::app()->japi->callAndSend('delRoleTarif', $params);
        }
        $this->success();
    }
    

    public function actionMassChangeRights () {
        $data = explode(',', $this->param('ids'));
        foreach($data as $id) {
            $params = array(
                'f_read' => (bool)true,
                'f_write' => ((int)$this->param('rights') > 0) ? (bool)true : (bool)false,
                'role_id' =>(int)$this->param('role_id')
            );
            
            if((int)$this->param('for_tariffs')>0) {
                $params['tar_id'] = (int)$id;
            } else {
                $params['user_group_id'] = (int)$id; 
            }
            
            $method = ((int)$this->param('for_tariffs')>0) ? 'setRoleTarif' : 'setRoleUserGroup';
            $result = yii::app()->japi->callAndSend($method, $params);
        }        
        $this->success();
    }
    
    
    /*
    * Groups
    */
    
    public function actionGroupsList () {
        $list = new OSSList(array(
            "useSort" => true
        ));
        
        $params = array(
            'pg_num' => (int)$this->param('pg_num'),
            'pg_size' => (int)$this->param('pg_size'),
            'role_id' =>(int)$this->param('role_id'),
            'un_used' => (bool)$this->param('un_used')
        );
        $result = $list->getList('getRoleUserGroups', $params);
        
        $data = $result["result"]->getResult();
        $total = $result["total"]->getResult();
        
        foreach($data as $k=>$item) {
            $data[$k]['rights'] = $item['f_write'] ? 1 : 0;
        }
        
        $this->success( $data, $total );
    }
    
    
    public function actionAddGroups () {
        $groups = explode(',', $this->param('user_group_id'));

        foreach($groups as $group) {
            $params = array(
                'f_read' => (bool)true,
                'f_write' => (bool)false,
                'role_id' =>(int)$this->param('role_id'),
                'user_group_id' => (int)$group
            );
            $result = yii::app()->japi->callAndSend('setRoleUserGroup', $params);
        }    
        
        $this->success();
    }
    
    
    public function actionChangeGroupsRights () {
        $params = array(
            'f_read' => (bool)true,
            'f_write' => ((int)$this->param('rights') > 0) ? (bool)true : (bool)false,
            'role_id' =>(int)$this->param('role_id'),
            'user_group_id' => (int)$this->param('user_group_id')
        );
        $result = yii::app()->japi->callAndSend('setRoleUserGroup', $params);   
        
        $this->success();
    }
    
    public function actionRemoveGroups () {
        $groups = explode(',', $this->param('user_group_id'));

        foreach($groups as $group) {
            $params = array(
                'role_id' =>(int)$this->param('role_id'),
                'user_group_id' => (int)$group
            );
            $result = yii::app()->japi->callAndSend('delRoleUserGroup', $params);
        }
        $this->success();
    }
    
} ?>
