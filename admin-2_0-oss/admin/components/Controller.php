<?php

class Controller extends LBController {
    /**
     * Language cookie name
     * @var string
     */
    private $langCookieName = 'lang';

    public function init() {
        parent::init();
        $this->initLanguage();
    }

    protected function defaultResponse() {
        return new OSSJsonResponse;
    }
    /**
     * Get cookie language and change settings if exists
     */
     private function initLanguage() {
        $language = Cookie::getCookie($this->langCookieName, ':');
        
        $language = $language ? $language : array();
        
        if(count($language) > 0 && false !== in_array($language[0], Yii::app()->locale->getLocaleIDs())) {
            Yii::app()->setLanguage($language[0]);
            
            return;
        }
        
        $this->setLanguageCookie();
    }
    protected function setLanguageCookie() {
        Cookie::setCookie(
            $this->langCookieName,
            Yii::app()->getLanguage(),
            Cookie::ThirtyDays 
        );
    }
    protected function nextMonth( $date ) {
        $date = explode( '-', $date );
        if ( $date[1] == '12' ) {
            $date[1] = '01';
            $date[0] = $date[0] + 1;
        } else {
            $date[1] = $date[1] + 1;
        }
        return $this->processDate( $date );
    }
    protected function processDate( $date ) {
        $date[1] = (string) $date[1];
        if (strlen($date[1]) == 1) {
            $date[1] = '0' . $date[1];
        }
        return $date[0] . '-' . $date[1] . '-01';
        return $date[0] . $date[1] . '01000000';
    }
    protected function formatDate( $date ) {
        $date = substr($date, 0, 10);
        $date = $date . ' 00:00:00';
        return $date;
    }
    protected function lastMonth( $date ) {
        $date = explode( '-', $date );
        if ( $date[1] == '01' ) {
            $date[1] = '12';
            $date[0] = $date[0] - 1;
        } else {
            $date[1] = $date[1] - 1;
        }
        return $this->processDate( $date );
    }
    protected function processError($error) {
        if ($error = UserIdentity::getAuthorizeError($error)) {
            $this->_error = $error;
        } else {
            $this->_error['code'] = $this->_error['status'];
            unset($this->_error['status']);
        }
        if ($error instanceof JAPIError) {
            $this->_error['type'] = $error->getTypeDescription();
        }
    }
    public function showError($status) {
        if (!YII_DEBUG && yii::app()->user->isGuest) {
            $status = 401;
        }
        parent::showError($status);
    }
    public function deleteList($method, $pk, $params = array()) {
        $ids = explode('.', $this->param('list', ''));
        if (!$ids) {
            return;
        }
        foreach ($ids as $id) {
            yii::app()->japi->call($method, array_merge($params, array(
                $pk => (int) $id
            )));
        }
        yii::app()->japi->send( true );
        $this->success(true);
    }
}

?>
