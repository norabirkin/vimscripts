<?php
/**
 * LANBilling access control filter
 *
 * Controll access rules for page by config
 */

class lbAccessControl extends CFilter
{
    public $page = '';

    public function preFilter($filterChain)
    {
        if (Yii::app()->params[$this->page]){
            return true;
        }
        throw new CHttpException(403,Yii::t('Application','This page is not allowed for you!'));
    }

    public function postFilter($filterChain) {}
}