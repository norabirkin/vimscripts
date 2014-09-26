<?php

class Localization extends CPhpMessageSource {
    public function getContent($category = 'messages') {
        return $this->loadMessages($category, Yii::app()->getLanguage());
    }
}

?>