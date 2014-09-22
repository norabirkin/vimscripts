<?php

class User extends CActiveRecord {
    public $name;
    public $surname;
    public $patronymic;
    public $pass_sernum;
    public $pass_no;
    public $email;
    public $phone;
    public $pass_issuedate;
    public $pass_issuedep;
    public $pass_issueplace;
    public $code;
    private $requiredErrors = array();

    public function rules() {
        $required = array();
        foreach (yii::app()->params['required'] as $k => $v) {
            if ($v) {
                $required[] = $k;
            }
        }
        return array(
            array(
                implode(',',$required),
                'application.components.RequiredValidator'
            ),
            array(
                'email',
                'email'
            ),
            array(
                'pass_sernum,pass_no',
                'numerical',
                'integerOnly' => true
            ),
            array(
                'name,'.
                    'surname,'.
                    'patronymic,'.
                    'phone,'.
                    'pass_issuedate,'.
                    'pass_issuedep,'.
                    'pass_issueplace,'.
                    'code',
                'safe'
            )
        );
    }
    public function setRequiredError($attributes, $index) {
        if (!isset($this->requiredErrors[$attributes])) {
            $this->requiredErrors[$attributes] = array();
            $this->requiredErrors[$attributes][] = $index;
        }
    }
    public function isRequiredError($attributes, $index) {
        return
            isset($this->requiredErrors[$attributes]) &&
            in_array($index, $this->requiredErrors[$attributes]);
    }
    public static function model($className=__CLASS__) {
        return parent::model($className);
    }
    public function tableName() {
        return 'users';
    }
    public function primaryKey() {
        return 'code';
    }
}

?>
