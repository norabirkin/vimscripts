<?php class AppInitHelper extends CApplicationComponent {
    private $authorized = false;

    public function isAuthorized() {
        return $this->authorized;
    }

    public function run() {
        $this->overrideNumberFormatter();
        if(!yii::app()->auth->setAuthorizationState()) {
            return false;
        } else {
            $this->authorized = true;
        }
        try {
            $this->getBaseData();
        } catch ( Exception $e ) {
            Yii::app()->user->setFlash('error', $e->getMessage() );
        }
        $this->initMenu();
    }

    private function overrideNumberFormatter() {
        yii::app()->setComponent('NumberFormatter', yii::createComponent(array(
                'class' => 'LBNumberFormatter'
            ),
            yii::app()->getLocale()
        ));
    }

    private function initMenu() {
        yii::app()->controller->pages = new LBPages;
        yii::app()->controller->pages->config($this->getMenu());
        yii::app()->controller->afterMenuConfigurated();
        $this->onMenuConfigurated(new CEvent);
    }

    public function onMenuConfigurated( CEvent $event ) {
        $this->raiseEvent('onMenuConfigurated', $event);
    }

    private function getMenu() {
        return require_once(yii::getPathOfAlias('application.components.menu.config').'.php');
    }

    private function getBaseData() {
        yii::app()->lanbilling->initSettings();
        yii::app()->lanbilling->getOperators();
        yii::app()->lanbilling->getClient();
        $this->getAgreements();
        $this->newHelpdeskMessages();
        $this->unpayedOrdersMessage();
        $this->setBaseRequestParams();
    }
    
    private function unpayedOrdersMessage() {
        if (yii::app()->params['unpaidorders_visible']) {
            yii::app()->controller->unpaidorders = yii::app()->lanbilling->get(
                "Count", 
                array(
                    "flt" => array(
                        "docpayable" => 1, 
                        "userid" => yii::app()->user->getId(),
                        'payed' => 0
                    ), 
                    "procname" => "getClientOrders"
                )
            );
            yii::app()->lanbilling->flushCache(array("getClientOrders"));
        }
    }   

    private function setBaseRequestParams() {
        yii::app()->controller->page = Yii::app()->request->getQuery('page', 0);
        yii::app()->controller->id = Yii::app()->request->getQuery('id', 0);
        yii::app()->controller->layout = empty($_SERVER['HTTP_X_REQUESTED_WITH']) ? yii::app()->controller->layout : '//layouts/ajax';
    }

    private function newHelpdeskMessages() {
        if (Yii::app()->params['main_note_helpdesk']) {                 
                    if (false !== ($msgCount = yii::app()->lanbilling->get(
                "Count", 
                array(
                    "flt" => array(
                        "unavail" => 0
                    ), 
                    "procname" => "getSbssTickets"
                )
            ))) yii::app()->controller->newmessages = $msgCount;
                    else yii::app()->controller->newmessages = 0;
                } else yii::app()->controller->newmessages = 0;
    }

    private function groupAgreementsByOperators() {
        $operators = array();
        foreach (yii::app()->lanbilling->clientInfo->agreements as $agreement) {
            if (empty($operators[$agreement->operid])) $operators[$agreement->operid] = array(); 
            $operators[$agreement->operid][] = $agreement;
        }
        ksort($operators);
        return $operators;
    }   

    private function getAgreements() {
        yii::app()->lanbilling->agreements = array();
        if (empty(yii::app()->lanbilling->clientInfo->agreements)) throw new Exception( $this->noAgreementsMessage() );
        foreach ($this->groupAgreementsByOperators() as $operator) {
            foreach ($operator as $agreement) $this->handleAgreement( $agreement );
        }
        if (empty(yii::app()->lanbilling->agreements)) throw new Exception( $this->noAgreementsMessage() );
    }

    private function handleAgreement( $agreement ) {
        if (!empty($agreement->number)) yii::app()->lanbilling->agreements[$agreement->agrmid] = $agreement;
        else {
            if (!empty($agreement->balance)) yii::app()->controller->userbalance = $agreement->balance . ' ' . $agreement->symbol;
        }
    }
    
    private function noAgreementsMessage() {
        return Yii::t('main','There is no available agreements. Please contact your manager.');
    }
    
} ?>
