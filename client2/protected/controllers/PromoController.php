<?php
class PromoController extends Controller {

    /**
     * Promotions menu. Main page.
     */
    public function actionIndex()
    {
    	$this->output($this->getPage()->menu());
    }
    
    public function actionCurrentPromotionsList (){
       
        yii::import('application.components.promo.*');
        $promo = new LB_Promo_Active;
    	$model = new Promo;
    	$promoData = $promo->data(true);
    	
    	if(count($promoData) == 0){
    		$this->output(Yii::t("promo","Actions list is empty"));
    		die();
    	}

        $promoString = "";
        foreach ($promoData as $promotion) {
        	$params = array(
        		'model'=> $model,
        		'title' => $promotion['title'],
        		'turnOffLink' => $promotion['turnOffLink'],
        		'period' => $promotion['period'],
        		'details' => $promotion['description']/*,
        		'description' => $promotion['actiondescr']*/
        		
        	);
        	$promoString .= $this->renderPartial('currentPromoRow', $params, true);
        }

        $params = array(
        		'model'=> $model,
        		'promotions' => $promoString
        );
        if(!isset($_GET['ajax'])) $this->render('promo',$params);
        else  $this->renderPartial('model',$params);
    }
    
    public function actionAvailablePromotionsList (){
    	
        yii::import('application.components.promo.*');
        $model = new Promo;
        $promo = new LB_Promo_Available;
    	$promoData = $promo->data(true);
    	
    	if(count($promoData) == 0){
    		$this->output(Yii::t("promo","NoPromo"));
    		die();
    	}
    	
    	$promoString = "";
    	foreach ($promoData as $promotion) {
    		$params = array(
    			'model'=> $model,
    			'title' => $promotion['title'],
    			'applylink' => $promotion['applylink'],
    			'period' => $promotion['period'],
    			'days' => $promotion['days'],
    			'description' => $promotion['description']
    		);
    		$promoString .= $this->renderPartial('availablePromoRow', $params, true);
    	}
    	
    	
    	$params = array(
    		'model'=> $model,
    		'promotions' => $promoString
    	);
    	if(!isset($_GET['ajax'])) $this->render('promo',$params);
    	else  $this->renderPartial('model',$params);    	
    }
    

    /**
     * Unsubscribe promo.
     */
    public function actionUnsubscribe()
    {
        $model = new Promo('Unsubscribe');
        $model->recordid     = Yii::app()->request->getParam('recordid',0);
        $model->actionid     = Yii::app()->request->getParam('actionid',0);
        $model->dtfrom     = Yii::app()->request->getParam('dtfrom','');
        $model->vgid     = Yii::app()->request->getParam('vgid',0);
        $model->agrmid   = Yii::app()->request->getParam('agrmid',0);
        // Валидация и попытка отключить акцию
        if ($model->validate() && $model->Unsubscribe()) {
            Yii::app()->user->setFlash('success',Yii::t('Promo','Участие в акции {promo} успешно прекращено.', array('{promo}' => Yii::app()->request->getParam('promo',''))));
            $this->redirect(array("/promo"));
        } else {
            Yii::app()->user->setFlash('warning',Yii::t('Promo','Внимание! Не удалось отказаться от участия в акции {promo}.', array('{promo}' => Yii::app()->request->getParam('promo',''))));
            $this->redirect(array("/promo"));
        }
    }

    /**
     * Apply promo.
     */
    public function actionApplyPromo()
    {
        $model = new Promo('addPromo');
		
		/*$promo_model = new getClientActions;
		$promo_model->group = false;
		$promo_model->promoType = (integer)Yii::app()->request->getParam('promoType',1);
		$promo_model->recordid = (integer)Yii::app()->request->getParam('recordid',0);
		if ($promo_model->promoType == 2) $column_name = Yii::t('Promo', 'Договор');
		elseif ($promo_model->promoType == 3) $column_name = Yii::t('Promo', 'Учетная запись');
 		$promo_model->getGrid(array(
			'column' => $column_name
		),'vgOrAgeements');*/
        //Dumper::dump($_POST);

        $model->promoType = (integer)Yii::app()->request->getParam('promoType',1);
        $model->recordid = (integer)Yii::app()->request->getParam('recordid',0);

        if (isset($_POST['promoType']) && $_POST['promoType'] == 0)
        {
            $recordid = Yii::app()->request->getParam('recordid',0);
            if ($recordid)
            {
                $model->actionid = $recordid;
                //$model->recordid = Yii::app()->request->getParam('recordid',0);
                $model->vgid     = Yii::app()->request->getParam('vgid',0);
                $model->agrmid   = Yii::app()->request->getParam('agrmid',0);

            	if ($model->ApplyPromo()){
                	Yii::app()->user->setFlash('success',Yii::t('promo','SuccessfullySubscribed'));
                }else{
                	if(strstr($model->errorMsg, "Запрещено_повторное_участие_в_акции")) {
                		Yii::app()->user->setFlash('error',Yii::t('promo','Repeated participation in promotion is not allowed', array('{action}' => Yii::app()->request->getParam('promoName',''))));
                	}
                	else {
                		Yii::app()->user->setFlash('error',Yii::t('promo','SubscribeError'));
                	}
                }
                $this->redirect(Yii::app()->createUrl('/promo'),true);
            }
        }

        if(!isset($_GET['ajax'])) $this->render('selectParams',array('model'=>$model));
        else  $this->renderPartial('selectParams',array('model'=>$model));

    }

    /**
     * $data the current row data
     * $row the row index
     * return $theCellValue;
     */
    public function applyActionSelLink($data,$row){
        $url = array("/promo/applyPromo");

        if ($data["agrmid"] > 0 && $data["vgid"] == 0)
        {
            $linkName = $this->lanbilling->agreements[$data['agrmid']]->number;
        } elseif ($data["vgid"] > 0) {
            $linkName = (empty($data["fullname"])) ? Yii::t('Services','<i>логин не назначен</i>') : $data["fullname"];
        }

        return CHtml::link(
            $linkName,
            $url,
            array(
                "submit"=>$url,
                'params' => array(
                    "recordid" => $data["recordid"],
                    "uid" => Yii::app()->user->getId(),
                    "agrmid" => $data["agrmid"],
                    "vgid" => $data["vgid"],
                    "promoType" => 0,
                ),
                'confirm' => Yii::t('promo','ConfirmSubscribe',array('{action}' => $data["name"]))
            )
        );
    }


    /**
     * Object cell in datagrid
     *
     * $data the current row data
     * $row the row index
     * return $theCellValue;
     */
    public function getObjectText($data,$row){
        if ($data['vgid'] > 0){
            return Yii::t('Promo','Действует на учетную запись <b>{vgroup}</b> договора <b>{agreement}</b>', array('{agreement}'=>$data['agrmnum'],'{vgroup}'=>$data['vglogin']));
        }elseif($data['agrmid'] > 0 && $data['vgid'] <= 0){
            return Yii::t('Promo','Действует на договор <b>{agreement}</b>', array('{agreement}'=>$data['agrmnum']));
        }elseif($data['agrmid'] <= 0 && $data['vgid'] <= 0){
            return Yii::t('Promo','Действует на пользователя <b>{username}</b>', array('{username}'=>$data['username']));
        }
    }

    /**
     * Object cell in available promo datagrid
     *
     * $data the current row data
     * $row the row index
     * return $theCellValue;
     */
    public function getObjectType($data,$row){
        switch ($data['object']) {
            case 0:
                return Yii::t('Promo','Пользователя');
            break;
            case 1:
                return Yii::t('Promo','Договор');
            break;
            case 2:
                return Yii::t('Promo','Учетную запись');
            break;
        }
    }

    /**
     * Link tu unsubscribe for current actions
     *
     * $data the current row data
     * $row the row index
     * return $theCellValue;
     */
    public function getDropLink($data,$row){
        $url = array("/promo/unsubscribe");
        return CHtml::link(
            Yii::t("Promo","Отказаться от участия"),
            $url,
            array(
                "submit"=>$url,
                'params' => array(
                    "recordid" => $data["recordid"],
                    "promo"    => $data["actionname"],
                ),
                'confirm' => Yii::t('Promo','Вы уверены, что хотите отказаться от участия в акции {action}?',array('{action}' => $data["actionname"]))
            )
        );
    }

    public function getApplyLink($data,$row){

        if ($data['actionsCount'] == 1)
        {
            $url = array("/promo/applyPromo");
            return CHtml::link(
                Yii::t("Promo","Принять участие"),
                $url,
                array(
                    "submit"=>$url,
                    'params' => array(
                        "recordid" => $data["recordid"],
                        "uid" => $data["uid"],
                        "agrmid" => $data["agrmid"],
                        "vgid" => $data["vgid"],
                        "promoType" => 0,
                    ),
                    'confirm' => Yii::t('Promo','Вы уверены, что хотите приянть участие в акции {action}?',array('{action}' => $data["name"]))
                )
            );
        }
        else
        {
            $url = array("/promo/applyPromo");

            if ($data['uid'] > 0){
                $urlTxt = Yii::t("Promo","Выбрать пользователя");
                $act = 1;
            }
            if ($data['agrmid'] > 0){
                $urlTxt = Yii::t("Promo","Выбрать договор");
                $act = 2;
            }
            if ($data['vgid'] > 0){
                $urlTxt = Yii::t("Promo","Выбрать учетную запись");
                $act = 3;
            }

            return CHtml::link(
                $urlTxt,
                $url,
                array(
                    'submit' => $url,
                    'params' => array(
                        'recordid' => $data['recordid'],
                        'promoType' => $act
                    ),
                )
            );
        }
    }


}
