<?php
class ManagersrolerulesController  extends Controller {
    
    public function actionList() {
        $data = $this->getRules();
        $this->success($data['result'], $data['total']);
    }

    private function getRules($defaultLimit = 100) {
        $templates = new OSSList(array(
            "useSort" => false,
            'defaultLimit' => $defaultLimit
        ));
        $templates = $templates->getList( 'getTemplateRules', array() );
        $total = $templates['total']->getResult();
        $templates = $templates['result']->getResult();

        $rules = new OSSList(array(
            "useSort" => false,
            'defaultLimit' => $defaultLimit
        ));
        $rules = $rules->getList( 'getRoleStaff', array(
            'role_id' => (int)$this->param("role_id")
        ));
        $rules = $rules['result']->getResult();

        $rulesWithIndexes = array();
        foreach ($rules as $key => $rule) {
            $rulesWithIndexes[$rule['rule_id']] = $rule['rw_flags'];
        }


        $result = array();
        foreach ($templates as $key => $template) {
            $result[] = array(
                'record_id' => $template['record_id'],
                'name'  => $template['name'],
                'descr'  => yii::t('messages', $template['descr']),
                'max_value_create' => $template['rw_flags']['create'],
                'max_value_delete' => $template['rw_flags']['delete'],
                'max_value_read' => $template['rw_flags']['read'],
                'max_value_update' => $template['rw_flags']['update'],
                'enabled' => $template['enabled'],
                'value_create' =>  $rulesWithIndexes[$template['record_id']]['create'],
                'value_delete' =>  $rulesWithIndexes[$template['record_id']]['delete'],
                'value_read' =>  $rulesWithIndexes[$template['record_id']]['read'],
                'value_update' => $rulesWithIndexes[$template['record_id']]['update']
            );
        }
        return array(
            'result' => $result,
            'total' => $total
        );
    }

    public function actionTree() {
        /*echo CJSON::encode(array(
            array(
                'text' => 'item # 1 Mary',
                'leaf' => false,
                'children' => array(
                    array(
                        'text' => 'item # 1 - 1 John',
                        'leaf' => false,
                        'children' => array(
                            array(
                                'text' => 'item # 1 - 1 - 1 Steve',
                                'leaf' => true,
                                'children' => array()
                            ),
                            array(
                                'text' => 'item # 1 - 1 - 2 Richard',
                                'leaf' => true,
                                'children' => array()
                            ),
                            array(
                                'text' => 'item # 1 - 1 - 3 Susan',
                                'leaf' => false,
                                'children' => array(
                                    array(
                                        'text' => 'item # 1 - 1 - 3 -1 Rick',
                                        'leaf' => true,
                                        'children' => array()
                                    )
                                )
                            ),
                            array(
                                'text' => 'item # 1 - 1 - 4 Johnny',
                                'leaf' => true,
                                'children' => array()
                            )
                        )
                    ),
                    array(
                        'text' => 'item # 1 - 2 Dave',
                        'leaf' => true,
                        'children' => array()
                    )
                )
            ),
            array(
                'text' => 'item # 2 Martin',
                'leaf' => true,
                'children' => array()
            )
        ));*/
        if (!(int) $this->param('role_id')) {
            $data = array();
        } else {
            $data = $this->getRules(1000);
            $rules = new Rules($data['result']);
            $data = $rules->getData();
        }
        echo CJSON::encode($data);
    }

    public function actionSave() { 
        $result = array();
        $error = array();
        $ids = array();
        $data = CJSON::decode((string) $this->param('data'), true);
        if (!$data) {
            $this->error();
        }
        foreach ($data as $item) {
            $result[(int) $item['rule_id']] = yii::app()->japi->call('setRoleStaff', array(
                'role_id' => (int) $item['role_id'], 
                'rule_id'  => (int) $item['rule_id'],
                'rw_flags' => array (
                    'create'  => $item['create'] == 1 ? true : false,
                    'delete'  => $item['delete'] == 1 ? true : false,
                    'read'  => $item['read'] == 1 ? true : false,
                    'update'  => $item['update'] == 1 ? true : false
                )
            ));
        }
        yii::app()->japi->send();
        foreach ($result as $k => $v) {
            if ($v->isError()) {
                $error[] = $v->getErrorMessage();
                $ids[] = $k;
            }
        }
        if ($ids) {
            $this->error(implode(' ', $error), $ids);
        } else {
            $this->success();
        }
    }
      
    
} ?>
