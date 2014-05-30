<?php
class SiteController extends Controller {

    public function actionIndex()
    {
        $this->redirect(array('account/index'));
    }

    public function beforeAction($action) {
        if ($action->getId() != 'logout' AND $action->getId() != 'login') {
            return parent::beforeAction($action);
        }
        return true;
    }
	
	
    /**
     * This action allows users to get messages to user
     */
    public function actionSupport() {
        $this->redirect(array('account/index'));
		if (!Yii::app()->user->isGuest) {
			$this->pageTitle = Yii::t('app', 'Support') . ' / ' . $this->lanbilling->clientInfo->account->name;
            $filter = array('userid' => $this->lanbilling->client);
            /* send message */
			if (Yii::app()->request->getParam('submit', '')) {
				$message = array(
					'uid' => $this->lanbilling->client,
					'category' => (int)Yii::app()->request->getparam("category", 1),
					'date' => date("Y-m-d H:i:s"),
					'title'  => Yii::app()->request->getparam("subject", ""),
					'body'   => Yii::app()->request->getparam("body", ""),
                    'parent' => (int)Yii::app()->request->getParam('parent',0)
				);
				//var_dump($message);die();
				if ($this->lanbilling->save("sendClientMessage", $message)) {
					$this->message = Yii::t('app', 'MessageSuccess');
					Yii::app()->user->setFlash('message',Yii::t('app', 'MessageSuccess'));
					$this->lanbilling->flushCache(array("getClientMessages"));
					$this->redirect(array('site/support'));
				} else {
					$this->message = Yii::t('app', 'MessageFailed');
				}
			}


            /* set all messages to viewed */
			$this->lanbilling->get("setClientMessagesViewed", $filter);
            $this->lanbilling->flushCache(array("getClientMessages"));

            /* get user messages with categories */
			$this->lanbilling->PostCategories = $this->lanbilling->get("getClientMessageCategories", array("flt" => $filter));
			$this->lanbilling->PostCategories  = is_array($this->lanbilling->PostCategories) ? $this->lanbilling->PostCategories : array($this->lanbilling->PostCategories);


			$this->lanbilling->Posts = $this->lanbilling->get("getClientMessages", array("flt" => $filter));
			$this->lanbilling->Posts  = ($this->lanbilling->Posts && is_array($this->lanbilling->Posts)) ? $this->lanbilling->Posts : array($this->lanbilling->Posts);

            $this->render('support');


		} else {
			$this->redirect(array("site/login"));
		}
	}

    public function actionKbdownload($id, $originalname) {
        $knowledges = new Sbss_Knowledges;
        $knowledges->download($id, $originalname);
    }

	/**
	 * This action allows users to get KB data
	 */
	public function actionKb() {
        $title = yii::t('knowledgebase', 'KnowledgeBase');
		$this->pageTitle = yii::app()->name . ' - ' . $title;
		$this->breadcrumbs = array($title);

        $knowledges = new Sbss_Knowledges;
        $data = $knowledges->getKnowledges();

        $this->render('kb', array(
            "data" => $data,
            "title" => $title
        ));
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError() {
		if ($error=Yii::app()->errorHandler->error) {
			if(Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			else
				$this->render('error', $error);
		}
	}

	public function actionLogout() {
		yii::app()->auth->logout();
		$this->redirect(array("site/login"));
	}

	public function actionLogin() {
		if (!Yii::app()->user->isGuest) $this->redirect(array("account/index"));
		$model = new LoginForm;
		if (isset($_POST["LoginForm"])) $this->processLogin($model);
		else $this->showLoginPage($model);
	}

	private function processLogin($model) {
		$model->attributes = $_POST['LoginForm'];
		if ( $model->validate() AND yii::app()->auth->login($model) ) $this->redirect(yii::app()->auth->getRedirectUrl());
		else $this->showLoginPage($model);
	}

	private function showLoginPage($model) {
		$this->pageTitle = Yii::t('login', 'AccountEnter');
		$this->render('login', array('model' => $model));
	}

	/**
	 * Restore password for given login
	 */
	public function actionRestore() {
		if (Yii::app()->user->isGuest) {
			if ($login = Yii::app()->request->getParam('login', '')) {
				if ($this->lanbilling->save("restoreClientPasswd", array('userid' => 0, 'login' => $login))) {
					$this->message = Yii::t('app', 'PasswordRestored');
					Yii::app()->user->setFlash('message',Yii::t('app','PasswordRestored'));
					Yii::app()->user->setFlash('success',Yii::t('app','PasswordRestored'));
					$this->redirect(array('site/login'));
				} else {
					Yii::app()->user->setFlash('error',Yii::t('app','PasswordNotRestored'));
					$this->message = Yii::t('app', 'PasswordNotRestored');
				}
			}
			$this->render('restore');
		} else {
			$this->redirect(array("account/index"));
		}
	}

	/**
	 * Logs out the current user and redirect to homepage.
	 */

}
