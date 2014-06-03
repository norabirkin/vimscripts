<?php

class TurboController extends Controller
{
    /**
     * Show welcome page
     */
    public function actionIndex() {
        if (Yii::app()->controller->module->terms)
        {
            $this->breadcrumbs = array(
                Yii::t('TurboModule.Turbo', 'Turbo'),
                Yii::t('TurboModule.Turbo', 'Terms')
            );
            if (Yii::app()->session->contains('license'))
                Yii::app()->session->remove('license');
            $this->render('Terms',array(
                'message' => 'With this service, you can increase the current speed to the Internet',
                'copyright_file_name' => 'copyright'
            ));
        }
        else
            $this->redirect(array('turbo/Step1'));
    }
    
    public function actionFunc1() {
        if (Yii::app()->controller->module->terms)
        {
            $this->breadcrumbs = array(
                Yii::t('TurboModule.Turbo', 'Turbo'),
                Yii::t('TurboModule.Turbo', 'Terms')
            );
            if (Yii::app()->session->contains('license'))
                Yii::app()->session->remove('license');
            $this->render('Terms',array(
                'message' => 'Некое сообщение',
                'copyright_file_name' => 'copyright1'
            ));
        }
        else
            $this->redirect(array('turbo/Step1'));
    }

    /**
     * Step 1
     *  - Get RADIUS vgroups
     */
    public function actionStep1()
    {
        $this->breadcrumbs = array(
            Yii::t('TurboModule.Turbo', 'Turbo') => array('/turbo'),
            Yii::t('TurboModule.Turbo', 'Selecting vgroup')
        );

        if ($license = Yii::app()->request->getParam('license', false)){
            if (!Yii::app()->session->contains('license'))
                Yii::app()->session['license'] = true;
        }


        if (Yii::app()->controller->module->terms && !Yii::app()->session->contains('license')){
            $error = Yii::t('TurboModule.Turbo', 'Sorry, error is here. You need to accept License Agreements first.');
            $this->render('_turboError',array('error' => $error));
        } else {
            // Clear different session data for every step
            if (Yii::app()->session->contains('tb_vgroup'))
                Yii::app()->session->remove('tb_vgroup');

            $model = new Turbo('selectVG');

            // Available vgroups for turbo
            if ($avlVgroups = $model->getAvlAccounts()){
                if(isset($_POST['Turbo']) === true) {
                    $model->attributes=$_POST['Turbo'];
                    if($model->validate() === true) {
                        Yii::app()->session['tb_vgroup'] = $model->vgroup;
                        $this->redirect(array('turbo/Step2'));
                    }
                }
            }
            else {
                $model->addError(null,Yii::t('TurboModule.Turbo','There is no available accounts'));
            }
            $params = array(
                'model'      => $model,
                'avlVgroups' => $avlVgroups,
                'alert_warning_message' => Yii::t('TurboModule.Turbo', 'There is no available accounts')
            );
            if(!isset($_GET['ajax'])) $this->render('Step1', $params);
            else  $this->renderPartial('Step1', $params);
        }
    }


    /**
     * Step 2
     *  - Get available services
     */
    public function actionStep2()
    {
        $this->breadcrumbs = array(
            Yii::t('TurboModule.Turbo', 'Turbo') => array('/turbo'),
            Yii::t('TurboModule.Turbo', 'Selecting vgroup') => array('turbo/Step1'),
            Yii::t('TurboModule.Turbo', 'Selecting service')
        );

        /**
         * Clear different session data for every step
         */
        if (Yii::app()->session->contains('tb_service'))
            Yii::app()->session->remove('tb_service');
        if (Yii::app()->session->contains('tb_agreement'))
            Yii::app()->session->remove('tb_agreement');

        if (!Yii::app()->session->contains('tb_vgroup')){
            $error = Yii::t('TurboModule.Turbo', 'Sorry, error is here. Click link below to return to the main page.');
            $this->render('_turboError',array('error' => $error));
        } else {
            $model = new Turbo('selectService');

            // selected RADUIS VGroup
            $radius_vg_id = $model->getTurboVGByID(Yii::app()->session['tb_vgroup'], array('agrmid'));

            if(isset($_POST['Turbo']) === true) {
                $model->attributes=$_POST['Turbo'];
                if($model->validate() === true) {
                    Yii::app()->session['tb_service'] = $model->service;
                    Yii::app()->session['tb_agreement'] = $radius_vg_id['agrmid'];
                    $this->redirect(array('turbo/Step3'));
                }
            }

            // Select available services
            if ($services = $model->getUsBOXServicesByAgrmID($radius_vg_id['agrmid'])){
                // Prepare services list
                $avlServices = CHtml::listData($services['items'],'catidx','descr');
            } else {
                $avlServices = array();
                $model->addError(null,Yii::t('TurboModule.Turbo','There is no available services'));
            }

            $params = array(
                'model'      => $model,
                'services' => $avlServices
            );
            if(!isset($_GET['ajax'])) $this->render('Step2', $params);
            else  $this->renderPartial('Step2', $params);
        }
    }

    /**
     * Step 3
     *  - Check balance and
     */
    public function actionStep3()
    {
        $this->breadcrumbs = array(
            Yii::t('TurboModule.Turbo', 'Turbo') => array('/turbo'),
            Yii::t('TurboModule.Turbo', 'Selecting vgroup') => array('turbo/Step1'),
            Yii::t('TurboModule.Turbo', 'Selecting service') => array('turbo/Step2'),
            Yii::t('TurboModule.Turbo', 'Selecting duration')
        );

        // Clear different session data for every step
        if (Yii::app()->session->contains('tb_duration'))
            Yii::app()->session->remove('tb_duration');

        $model = new Turbo('selectDuration');
        
        $turbo_shape = $model->getUsBOXServicesByAgrmID(
            Yii::app()->session->get('tb_agreement'),
            Yii::app()->session->get('tb_service'),
            array('descr','above','script')
        );
        $speed = explode(':',$turbo_shape['script']);
        $speed = $speed[3];
        
        $agreement = Yii::app()->session->get('tb_agreement');
        $vgroup = Yii::app()->session->get('tb_vgroup');
        $catidx = Yii::app()->session->get('tb_service');
        
        if(isset($_POST['Turbo']) === true) {
            $model->attributes=$_POST['Turbo'];
            if($model->validate() === true) {
                Yii::app()->session['tb_duration'] = $model->duration;
                $this->redirect(array('turbo/Step4'));
            }
        }
        $params = array(
            'model'      => $model,
            'speed' => $speed,
            'descr' => $turbo_shape['descr']
        );
        if(!isset($_GET['ajax'])) $this->render('Step3', $params);
        else  $this->renderPartial('Step3', $params);
    }

    /**
     * Step 4
     *  - Confirm the purchase
     */
    public function actionStep4()
    {
        $this->breadcrumbs = array(
            Yii::t('TurboModule.Turbo', 'Turbo') => array('/turbo'),
            Yii::t('TurboModule.Turbo', 'Selecting vgroup') => array('turbo/Step1'),
            Yii::t('TurboModule.Turbo', 'Selecting service') => array('turbo/Step2'),
            Yii::t('TurboModule.Turbo', 'Selecting duration') => array('turbo/Step3'),
            Yii::t('TurboModule.Turbo', 'Common info')
        );

        if (!Yii::app()->session->contains('tb_vgroup') || !Yii::app()->session->contains('tb_service') || !Yii::app()->session->contains('tb_duration')){
            $error = Yii::t('TurboModule.Turbo', 'Sorry, error is here. Click link below to return to the main page.');
            $this->render('_turboError',array('error' => $error));
            return;
        } else {

            $model = new Turbo('summary');

            /**
             * Услуга
             */
            $services = $model->getUsBOXServicesByAgrmID(
                Yii::app()->session->get('tb_agreement'),
                Yii::app()->session->get('tb_service'),
                array('tarid','descr','above','vgid','script')
            );
            
            $speed = explode(':',$services['script']);
            $speed = $speed[3];
            
            /**
             * Баланс договора
             */
            $agrmData = $model->getAgrmData(Yii::app()->session->get('tb_agreement'), array('balance'));

            /**
             * Полная стоимость услги
             */
            $totalCost = Yii::app()->session->get('tb_duration') * $services['above'];

            /**
             * Баланс договора
             */
            $agrmData = $model->getAgrmData(Yii::app()->session->get('tb_agreement')/*, array('balance','credit','number')*/);
            $cost = array(
                'duration'     => Yii::app()->session->get('tb_duration'), // Длительность услуги
                'balance'      => $agrmData['balance'], // Баланс договора
                'credit'       => $agrmData['credit'], // Кредит у договора
                'totalBalance' => $agrmData['balance'] + $agrmData['credit'], // Итоговая сумма, доступная для списания (баланс с учетом кредита)
                'agrmNumber'   => $agrmData['number'], // Номер договора
                'serviceCost'  => $services['above'], // Стоимость единицы услуги
                'serviceDescr' => $services['descr'], // Описание услуги
                'totalCost'    => $totalCost, // Стоимость услуги с учетом длительности
                'speed' => $speed
            );

            if ($totalCost > ($agrmData['balance'] + $agrmData['credit']))
                Yii::app()->user->setFlash('warning',Yii::t('TurboModule.Turbo','Not enough balance'));

            $params = array(
                'model' => $model,
                'cost'  => $cost,
            );

            if(isset($_POST['Turbo']) === true) {
                $model->attributes=$_POST['Turbo'];
                if($model->validate() === true) {


                    // $serv_vg_id, $tarid, $catidx, $duration, $account_vg
                    $success = $model->setCurrentTurbo(
                        $services['vgid'],
                        $services['tarid'],
                        Yii::app()->session->get('tb_service'),
                        Yii::app()->session->get('tb_duration'),
                        Yii::app()->session->get('tb_vgroup')
                    );

                    if ($success){
                        Yii::app()->session->remove('tb_vgroup');
                        Yii::app()->session->remove('tb_service');
                        Yii::app()->session->remove('tb_duration');
                        $this->render('finish', $params);
                        return;
                    }
                    else {
                        $error = Yii::t('TurboModule.Turbo', 'Sorry, error is here. Click link below to return to the main page.');
                        $this->render('_turboError',array('error' => $error));
                        return;
                    }
                }
            }

            if(!isset($_GET['ajax'])) $this->render('Step4', $params);
            else  $this->renderPartial('Step4', $params);

        }
    }

    public function purchase()
    {

    }


    /**
     * Get list of available services
     */
    public function actionGetservices()
    {
        if(Yii::app()->request->isAjaxRequest)
        {
            $vgid = Yii::app()->request->getParam('vgid', 0);
            if ($vgid) {
                $model = new Turbo;
                $data = $model->getAvlServices();
                foreach($data as $value=>$name)
                {
                    echo CHtml::tag('option', array('value'=>$value),CHtml::encode($name),true);
                }
            } else {
                echo CHtml::tag('option', array('value'=>0),CHtml::encode(''),true);
            }
            //$data=CHtml::listData($data,'id','name');
        }
    }


}