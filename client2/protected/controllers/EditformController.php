<?php

/*
 * Значение переменной $property в действии actionUpdateAccount 
 * является название свойства аккаунта, такое как phone или email.
 * Переменные $equipid и $cardid в действиях  actionUpdateEquipmentDescription
 * и actionUpdateSmartcardDescription содержат id оборудования и смарткарты
 * соответственно. Переменная $value содержит значение, введенное в поле формы
 * редактирования. По завершении всех необходимых действий должен быть выведен
 * ответ на запрос в формате json. Json-объект должен иметь два свойства -
 * "value", значением которого должно быть новое значение введенной пользователем
 * в форму редактирования и "error", значением которого должно быть false, при
 * успешном завершении редактирования.
 */

class EditFormController extends Controller
{
    public function actionUpdateAccount() {
        $property = $_POST['property'];
        if (!yii::app()->params['editing_client_info'][$property]) {
            echo json_encode(
                    array(
                        'value' => '',
                        'error' => 'Access denied'
                    )
            );
        }
        $value = htmlentities( substr($_POST['value'], 0, 32) );
        $filter = array('flt' => array('userid' => $this->lanbilling->client));
        $client_info = $this->lanbilling->get('getClientInfo',$filter);
        foreach ($client_info as $k => $v) $options[$k] = $v;
        $options[$property] = $value;
        $success = $this->lanbilling->save('setClientInfo',$options);
        if ($success) $error = false;
        else $error = $this->lanbilling->Errors;
        echo json_encode(
                array(
                    'value' => $value,
                    'error' => $error
                )
        );
    }
    public function actionUpdateEquipmentDescription() {
        if (!Yii::app()->user->isGuest) {
            $equipid = (int) $_POST['id'];
            $value = $_POST['value'];
	    $success = $this->lanbilling->get("setEquipment", array("val" => array(
	    	"equipid" => $equipid,
		"descr" => $value
	    )));
            if ($success) $error = false;
            else $error = $this->lanbilling->Errors;
            echo json_encode(
                    array(
                        'value' => $value,
                        'error' => $error
                    )
            );
        }
    }
    public function actionUpdateSmartcardDescription() {
        
        if (!Yii::app()->user->isGuest) {
            $cardid = $_POST['id'];
            $value = $_POST['value'];
            $success = $this->lanbilling->save('setSmartCard', array(
                'cardid' => $cardid,
                'descr' => $value
            ));
            if ($success) $error = false;
            else $error = $this->lanbilling->Errors;
            echo json_encode(
                    array(
                        'value' => $value,
                        'error' => $error
                    )
            );
        }
    }
}

?>
