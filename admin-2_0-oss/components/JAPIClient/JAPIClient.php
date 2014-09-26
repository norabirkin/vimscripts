<?php

class JAPIClient extends CApplicationComponent {
    private $JAPILog;
    private $base;
    public function init() {
        parent::init();
        $this->base = new JAPIClientBase;
        $this->addHandlers(array(
            'onCall',
            'onSend',
            'onError',
            'translate'
        ));
    }
    public function translate($msg) {
        return yii::t('errors', $msg);
    }
    public function onCall($params) {
        if (yii::app()->params['logJAPIConnection']) {
            $this->getJAPILog()->addCallTrace($params['transaction']);
        }
    }
    public function onSend($params) {
        if (yii::app()->params['logJAPIConnection']) {
            $this->getJAPILog()->logConnection($this->base->getJAPIConnection());
        }
        if (yii::app()->params['logErrors']) {
            $this->getJAPILog()->logError($this->base->getJAPIConnection());
        }
    }
    public function onError($params) {
        if (!$params['msg']) {
            $params['msg'] = 'Unknown error';
        }
        if (is_string($params['msg'])) {
            $params['msg'] = array(
                $params['msg'],
                null
            );
        }
        if ($params['code'] == JAPIClientBase::ERROR_DEFAULT) {
            throw new CHttpException(
                500,
                yii::t(
                    'errors',
                    $params['msg'][0],
                    $params['msg'][1]
                )
            );
        } elseif ($params['code'] == JAPIClientBase::ERROR_JSON_PARSE) {
            throw new JAPIDataError(
                500,
                yii::t(
                    'errors',
                    $params['msg'][0],
                    $params['msg'][1]
                )
            );
        } elseif ($params['code'] == JAPIClientBase::ERROR_JSON_RESPONSE) {
            throw new JAPIResponseError(
                500,
                $params['msg'][0],
                $params['params']['transaction']
            );
        } elseif ($params['code'] == JAPIClientBase::ERROR_CONNECTION) {
            throw new JAPIConnectionError(
                500,
                yii::t(
                    'errors',
                    $params['msg'][0],
                    $params['msg'][1]
                )
            );
        }
    }
    public function call($method, $params = null) {
        return $this->base->call($method, $params);
    }
    public function callAndSend($method, $params = array()) {
        return $this->base->callAndSend($method, $params);
    }
    public function send($abortIfError = false) {
        return $this->base->send($abortIfError);
    }
    public function hasRequest() {
        return $this->base->hasRequest();
    }
    public function getJAPILog() {
        if (!$this->JAPILog) {
            $this->JAPILog = JAPILog::factory(yii::app()->params['logFormat']);
        }
        return $this->JAPILog;
    }
    public function addHandlers($events) {
        foreach ($events as $item) {
            $this->base->addHandler($item, array(
                $this,
                $item
            ));
        }
    }
}

?>
