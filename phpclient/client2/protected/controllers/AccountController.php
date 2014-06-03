<?php
class AccountController extends Controller
{

    private $__msg = '';


    /**
     * Get the list of the services for USBox tariff according to passed account identification
     * number and its tariff settings
     * @param	object, billing class
     */
    function getUSBoxForVgCur($vg_id = 0)
    {
        if((integer)$vg_id == 0) return false;

        /**
         * Available filters
         * vgid: account id
         * common: -1 all, 0 - once, 1 - all periodic
         */
        $_filter = array(
            "vgid" => (integer)$vg_id,
            "common" => -1
        );
        $_tmp = array();
        if( false != ($result = $this->lanbilling->get("getVgroupServices", array("flt" => $_filter),true)) ) {
            if(!is_array($result)) {
                $result = array($result);
            }
            array_walk($result, create_function('$item, $key, $_tmp', '
                if ($item->servid > 0)
				$_tmp[0][] = array(
                    "serviceid" => $item->servid,
                    "common" => $item->common,
                    "vgid" => $item->vgid,
                    "tarid" => $item->tarid,
                    "catidx" => $item->catidx,
                    "dateon" => $item->vgrfirston,
                    "timefrom" => $item->timefrom,
                    "timeto" => $item->timeto,
                    "catdescr" => $item->catdescr,
                    "above" => $item->above,
                    "mul" => $item->mul,
                    "personid" => $item->personid,
                    "used" => $item->assigned,
                    "symbol" => $item->symbol,
                    "flagused" => $item->assigned
                );
            '), array( &$_tmp ));
        }

        if(sizeof($_tmp) > 0) { return $_tmp; } else { return false; }
    } // end getUSBoxForVg

    
    public function sort_tarif_changes_objects_by_date($a, $b) {
        if ((int)strtotime($a->changetime) < (int)strtotime($b->changetime)) {
            return -1;
        }
        elseif ((int)strtotime($a->changetime) > (int)strtotime($b->changetime)) {
            return 1;
        }
        else return 0;
    }

    /**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionSharedposts(){
        if ( !yii::app()->params["shared_posts_history"] ) throw new CHttpException(403,Yii::t('Application','This page is not allowed for you!'));
		$this->pageTitle = Yii::app()->name.' - '.Yii::t('account', 'SharedPostsHistory');
    		$this->breadcrumbs = array(
        		Yii::t('account', 'SharedPostsHistory'),
    		);
		$grid = new SharedPostsHistoryGrid;
		$this->render("sharedposts", array(
			"title" => Yii::t('account', 'SharedPostsHistory'),
			'grid' => $grid->Render()
		));
	}
    private function getLastMessage() {
        if (!($message = SharedPosts::getLast())) {
            return;
        } else {
            return $message->text;
        }
    }
    public function HTMLBeforeTitle() {
        return $this->__msg;
    }
    public function actionIndex() {
        yii::import('application.components.accounts.Accounts_Agreements');
        $accounts = new Accounts_Agreements;
        $this->__msg = $this->renderPartial('application.components.views.SharedPosts', array(
            'text' => $this->getLastMessage()
        ), true);
        $this->output($accounts->output());
    }
    public function beforeFormRender($items, $form) {
        $array1 = new LB_Form_Item_Array(array('name' => 'some'));
        $array2 = new LB_Form_Item_Array(array('name' => 'namespace'));
        $array2->setParent($array1);
        foreach ($items as $item) {
            if (!$item->getParent()) {
                $item->setParent($array2);
            }
        }
        $form->setBeforeItemAddHandler(array($this, 'beforeHiddenFieldAdd'));
        $form->hidden(array(
            'r' => 'account/index',
            'step' => 1,
            'some' => array(
                'namespace' => array(
                    'items' => array(
                        'subitems' => array(
                            'dtto' => '2014-05-05',
                            'param-001' => 'val-001'
                        )
                    )
                )
            ),
            'params' => array(
                'agrmid' => 54,
                'vgids' => array(
                    53,
                    56,
                    42
                )
            )
        ));
        $form->setBeforeItemAddHandler(null);
    }
    public function beforeHiddenFieldAdd($item, $form) {
        return !$form->hasField($item->get('name'));
    }
    public function actionVgroups( $agrmid, $page = 1 ) {
        yii::import('application.components.accounts.Accounts_Grid');
        yii::import('application.components.accounts.grid.*');
        $agreements = new Agreements;
        $data = $agreements->getVgroups($agrmid, $page);
        echo CJSON::encode(array(
            "head" => $agreements->getVgroupsHeaders(),
            "body" => $data["rows"],
            "empty" => yii::t('account', 'No accounts found'),
            "pager" => $agreements->getPager(array(
                "total" => $data["total"],
                "page" => $page,
                'limit' => yii::app()->params['paging']['default_limit'],
                "route" => "account/vgroups",
                "params" => array( "agrmid" => $agrmid )
            ))
        ));
    }

    /**
     * This action control change password functionality for vGroup
     */
    public function actionPassword()
    {
        $model = NEW Account('changeVgPassword');

        if (isset($_POST['ajax']) && $_POST['ajax'] === 'changepass-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }

        $vgid = Yii::app()->request->getParam('vgid', false);
        $vglogin = Yii::app()->request->getParam('vglogin', false);

        if (Yii::app()->session->contains('chp_vgid') && Yii::app()->session->get('chp_vgid') > 0) {
            if ($vgid && $vgid != Yii::app()->session->get('chp_vgid')) {
                Yii::app()->session->remove('chp_vgid');
                Yii::app()->session['chp_vgid'] = $vgid;
            } else {
                $vgid = Yii::app()->session->get('chp_vgid');
            }
        } else {
            if ($vgid) Yii::app()->session['chp_vgid'] = $vgid;
        }

        if (Yii::app()->session->contains('chp_vglogin') && Yii::app()->session->get('chp_vglogin',false) ) {
            if ($vglogin && $vglogin != Yii::app()->session->get('chp_vglogin')) {
                Yii::app()->session->remove('chp_vglogin');
                Yii::app()->session['chp_vglogin'] = $vglogin;
            } else {
                $vglogin = Yii::app()->session->get('chp_vglogin');
            }
        } else {
            if ($vglogin) Yii::app()->session['chp_vglogin'] = $vglogin;
        }

        if (!$vgid){
            throw new CHttpException(404,Yii::t('Account','Необходимо выбрать учетную запись!'));
        }

        $model->vglogin = htmlentities( $vglogin );
        $model->vgid = $vgid;

        if(isset($_POST['Account'])) {
            $model->attributes=$_POST['Account'];
            if ($model->validate()) {
                if ($model->changeVgPasswd()){
                    Yii::app()->session->remove('chp_vgid');
                    Yii::app()->session->remove('chp_vglogin');
                    Yii::app()->user->setFlash('success',Yii::t('Account', "Пароль для учетной записи {vglogin} успешно изменен.",array('{vglogin}'=>$model->vglogin)));
                    $this->redirect(array("account/index"));
                }
            }
        }

        $this->render('changeVgPassword',array(
                'model' => $model
            )
        );
    }

    /**
	 * This action allows users to show / edit accout info
	 */
	public function actionSettings() {
        if ( !yii::app()->params["menu_settings"] ) throw new CHttpException(403,Yii::t('Application','This page is not allowed for you!'));
		if (!Yii::app()->user->isGuest) {
			$this->breadcrumbs = array(
				Yii::t('settings', 'Settings')
			);
			$this->pageTitle = yii::app()->name . ' - ' . Yii::t('settings', 'Settings');
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
				$keys = array('email');
				if ( yii::app()->params["allow_edit_phone"] ) $keys[] = 'phone';
				if (Yii::app()->request->getParam('pass', '') != Yii::app()->request->getParam('confirm', '')) {
					$this->message = Yii::t('settings', 'PasswordNotMatch');
				}
				if (Yii::app()->request->getParam('pass', '') && strlen(Yii::app()->request->getParam('pass', '')) < 6) {
					$this->message = Yii::t('settings', 'PasswordTooShort');
				}
				if ($pass = Yii::app()->request->getParam('pass', '')) {
					
					$regExp = Yii::app()->controller->lanbilling->getOption("user_pass_symb");
					if (!$regExp) $regMatch = true;
					else $regMatch = preg_match( '/'.$regExp.'/', $pass ); 
					
					if (!$regMatch) $this->message = Yii::t(
						'Account', 
						'Пароль содержит недопустимые символы. Пароль должен соответствовать регулярному выражению ' . $regExp 
					);
					
				}
				if (empty($this->message)) {

					if (Yii::app()->request->getParam('pass', '')) {
                                                //$keys[] = 'pass';
                                                $struct = array("id" => yii::app()->controller->lanbilling->client,
                                                        "vgid" => 0,
                                                        "oldpass" => yii::app()->request->getParam('currpass', ''),
                                                        "newpass" => yii::app()->request->getParam('pass', ''));

                                                if( false == yii::app()->controller->lanbilling->get("updClientPass", $struct, true)) {

                                                        $this->message = Yii::t('settings', 'AccountNotSaved');
                                                        Yii::app()->user->setFlash('error',Yii::t('settings','AccountNotSaved'));                  
                                                        $this->render('account');
                                                        die();
                                                }

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

						$this->message = Yii::t('settings', 'AccountSaved');
						Yii::app()->user->setFlash('success',Yii::t('settings','AccountSaved'));

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
						$this->message = Yii::t('settings', 'AccountNotSaved');
						Yii::app()->user->setFlash('error',Yii::t('settings','AccountNotSaved'));
					}
				}
			}
			$this->render('account');
		} else {
			$this->redirect(array("site/login"));
		}
	}




	/**
	 * Show shared posts table
	 * @param	object, billing class
	 * @param	object, template class
	 */
	public function getShared()
	{
		if ( !yii::app()->params["shared_posts"] ) return false;
		$this->lanbilling->flushCache(array("getClientSharedPosts"));
		if( false == ($post = $this->lanbilling->getRows("getClientSharedPosts")) ) { return false; }
		return $post;
	} // end getShared()


}
