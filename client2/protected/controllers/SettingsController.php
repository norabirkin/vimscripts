<?php
class SettingsController extends Controller {

    /**
     * @return array action filters
     */
    public function filters()
    {
        return CMap::mergeArray(parent::filters(),array(
            array(
                'application.filters.lbAccessControl',
                'page' => 'menu_settings'
            )
        ));
    }



    public function actionIndex()
    {

        //Dumper::dump($this->lanbilling->get('getActions'));

        $params = array();
        if(!isset($_GET['ajax'])) $this->render('settings',$params);
        else  $this->renderPartial('settings',$params);
    }


    /**
	 * This action allows users to show / edit accout info
	 */
	public function actionSettings() {
		if (!Yii::app()->user->isGuest) {
			$this->pageTitle = Yii::t('app', 'PersonalAccount') . ' / ' . $this->lanbilling->clientInfo->account->name;

			$filter = array("userid" => $this->lanbilling->client);
			$this->lanbilling->subscriptions = $this->lanbilling->get("getClientMessageCategories", array("flt" => $filter));

			$this->lanbilling->subscriptions  = is_array($this->lanbilling->subscriptions) ? $this->lanbilling->subscriptions : array($this->lanbilling->subscriptions);
			if (Yii::app()->request->getParam('submit', '')) {
                /* subscriptions form */
//				$subscriptions = array();
//				$cats = Yii::app()->request->getParam('category', array());
//				foreach ($this->lanbilling->subscriptions as $id => $item) {
//					$enabled = !empty($cats[$item->category]) && $cats[$item->category] == 'on' ? 1 : 0;
//                    /* formrequest to API */
//					$subscriptions[] = array('category' => $item->category, 'enabled' => $enabled);
//                    /* update current list */
//					$this->lanbilling->subscriptions[$id]->enabled = $enabled;
//				}
				$values = array('userid' => $this->lanbilling->client);
				$keys = array('email', 'phone');
				if (Yii::app()->request->getParam('pass', '') != Yii::app()->request->getParam('confirm', '')) {
					$this->message = Yii::t('app', 'PasswordNotMatch');
				}
				if (Yii::app()->request->getParam('pass', '') && strlen(Yii::app()->request->getParam('pass', '')) < 6) {
					$this->message = Yii::t('app', 'PasswordTooShort');
				}
				if (empty($this->message)) {
					if (Yii::app()->request->getParam('pass', '')) {
						$keys[] = 'pass';
					}
					foreach ($keys as $key) {
						if ($value = Yii::app()->request->getParam($key, '')) {
							$values[$key] = $value;
						}
					}
                    /* save account info */

					if ($this->lanbilling->save("setClientInfo", $values)) {

						foreach ($values as $key => $value) {
							if (isset($this->lanbilling->clientInfo->account->$key)) {
								$this->lanbilling->clientInfo->account->$key = $value;
							}
						}

						$this->message = Yii::t('app', 'AccountSaved');
						Yii::app()->user->setFlash('success',Yii::t('Settings','AccountSaved'));

                        /* save subscriptions */
						//if(Yii::app()->request->getParam('category'))
						//{
						//	if ($this->lanbilling->save("setClientSubscriptions", array('categories' => $subscriptions), false, array(), $filter)) {
						//		$this->message = Yii::t('app', 'AccountSaved');
						//	} else {
						//
						//		$this->message = Yii::t('app', 'SubscriptionsNotSaved');
						//	}
						//}

						$this->lanbilling->flushCache(array("getClientAccount", "getClientMessageCategories"));
					} else {
						$this->message = Yii::t('app', 'AccountNotSaved');
						Yii::app()->user->setFlash('error',Yii::t('Settings','AccountNotSaved'));
					}
				}
			}
			$this->render('account');
		} else {
			$this->redirect(array("site/login"));
		}
	}


}
