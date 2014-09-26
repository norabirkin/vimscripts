<?php
class UsergroupsController extends Controller{
    
    public function actionAddNewGroup() {

        $this->success( yii::app()->japi->callAndSend('setUserGroups', array(
            "name" => (string) $this->param('name'),
            "description" => (string) $this->param('description'),
        )));
    }
    
    
    public function actionSaveGroupData() {
        $struct = array(
            "groupid" => ((int) $this->param('groupid')) == -1 ? null : (int) $this->param('groupid'),
            "name" => (string) $this->param('name'),
            "description" => (string) $this->param('description'),
            "blockamount" => (float) $this->param('blockamount'),
            "blockdurationdebtor" => (int) $this->param('blockdurationdebtor'),
            "blockdurationdenouncement" => (int) $this->param('blockdurationdenouncement'),
            "curid" => (int) $this->param('curid'),
            "promiseallow" => ((string)$this->param('promiseallow') == 'on') ? true : false,
            "promiseblockdays" => (int) $this->param('promiseblockdays'),
            "promiselimit" => (float) $this->param('promiselimit'),
            "promisemax" => (float) $this->param('promisemax'),
            "promisemin" => (float) $this->param('promisemin'),
            "promiseondays" => (int) $this->param('promiseondays'),
            "promiserent" => ((string)$this->param('promiserent') == 'on') ? true : false,
            "promisetill" => (int) $this->param('promisetill')
        );
        $this->success( yii::app()->japi->callAndSend('setUserGroups', $struct));
    }

    public function actionRemoveAll() {
        $this->success(yii::app()->japi->callAndSend('delUserGroupStaff', array(
            'group_id' => (int) $this->param('group_id')
        )));
    }
    
    public function actionSetToGroup() {        
        $delete = (int) $this->param('del');
        
        $string = str_replace(array('[', ']'), '', $this->param('uids'));
        $data = explode(',', $string);
        
        foreach ($data as $uid) {
            $struct = array(
                "uid" => (int) $uid,
                "group_id" => (int)$this->param('group_id'),
            );
            
            yii::app()->japi->call( ($delete > 0) ? 'delUserGroupStaff' : 'setUserGroupStaff', $struct);
        }
        yii::app()->japi->send(true);
        $this->success(array());
    }
    
    
    public function actionWithGroup() {
        $params = array(
            "is_archive" => false,
            "in_group" => (int) $this->param('groupid', 0)
        );

        if ($this->param('search_field') && $this->param('search_field_value')) {
            $params[$this->param('search_field')] = (string) $this->param('search_field_value');
        }

        $result = new OSSList( array("useSort" => false) );
        $result = $result->getList( 'getAccounts', $params );
        $total = $result['total']->getResult();
        $result = $result['result']->getResult();
        
        foreach ($result as $account) {
            $data[] = array(
                "uid" => $account['uid'],
                "name" => $account['name'],
                "group_id" => (int) $this->param('groupid', 0)
            );
        }       
        $this->success($data, $total);
        
    }
        
    public function actionWithoutGroup() {
        $params = array(
            "is_archive" => false,
            "not_in_group" => (int) $this->param('groupid', 0)
        );

        if ($this->param('search_field') && $this->param('search_field_value')) {
            $params[$this->param('search_field')] = (string) $this->param('search_field_value');
        }

        $result = new OSSList( array("useSort" => false) );
        $result = $result->getList( 'getAccounts', $params );
        $total = $result['total']->getResult();
        $result = $result['result']->getResult();
        
        foreach ($result as $account) {
            $data[] = array(
                "uid" => $account['uid'],
                "name" => $account['name'],
                "group_id" => (int) $this->param('groupid', 0)
            );
        }
        
        $this->success($data, $total);
    }
    
    public function actionDelete() {

        $this->success( yii::app()->japi->callAndSend( 'delUserGroup', array(
            "group_id" => (int) $this->param('groupid', 0)
        )));
        
    }
    
    public function actionList() {
        $groups = new OSSList( array("useSort" => false) );
        $groups->get( 'getUserGroups' );
    }
    
} ?>
