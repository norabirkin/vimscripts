<?php
class SharedpostsController extends Controller {
	
	public function init() {
		parent::init();
		yii::import('application.components.sharedposts.*');
	}

    public function actionIndex()
    {
		$html = $this->getPage()->menu();
		$this->output($html);
    }
	
	
    public function actionNotices()
    {
		if(yii::app()->request->getParam('save', '')>0) {
			$block = yii::app()->request->getParam('firstBlock', array());
			$sharedBlock = yii::app()->request->getParam('secondBlock', array());
			$minBalance = yii::app()->request->getParam('balvalue', '');
			$struct = array();
			$structShared = array();


			// Формируем массив для первого блока
			foreach($block as $k=>$v) {
				$struct['notices'][$k]['type'] = $v;
				
				if($v == 1) {
					$struct['notices'][$k]['value'] = ($minBalance != '') ? $minBalance : 0;
				} else {
					$struct['notices'][$k]['value'] = 1;
				}					
			}
			
			// Формируем массив для второго блока
			if(!empty($sharedBlock)) {
				foreach($sharedBlock as $sk=>$post) {
					$structShared['categories'][$sk] = $post;					
				}
			}		
			
			// Сохраняем данные первого блока и второго блока
			$ret = $this->lanbilling->get("setAccountNotices", array('an' => $struct));			
			$ret2 = $this->lanbilling->get("setAccountSharedPostCategories", array('an' => $structShared));
			
			
			if((int)$ret>0 && (int)$ret2>0) {
				yii::app()->user->setFlash( "success", Yii::t('messages','Data saved successful'));
			} else {
				yii::app()->user->setFlash( "error", Yii::t('messages','Error while data saving'));
			}
		}		
		
		$result = $this->lanbilling->get("getAccountNotices", array('flt'=>array()));		
		if(!is_array($result->notices)) $result->notices = array($result->notices);
		
		$checkedFirst = array();
		foreach($result->notices as $notice) {
			if($notice->type == 1) {
				$balanceValue = ($notice->value != '') ? $notice->value : 0;
			}
			$checkedFirst[] = $notice->type;
		}
		
		$data = array(			
		    array(
		        'type' => 'hidden',
		        'name' => 'r',
				'value' => 'sharedposts/notices'
		    ),
		    array(
		        'type' => 'hidden',
		        'name' => 'save',
				'value' => 1
		    ),
		    array(
		        'type' => 'text',
		        'name' => 'email',
				'label' => Yii::t('messages','E-mail address'),
				'value' => $this->lanbilling->clientInfo->account->email,
				'options' => array(
					'readonly' => true,
					'disabled' => true
				)
		    ),
		    array(
		        'type' => 'checkboxlist',
		        'name' => 'firstBlock',
				'checked' => $checkedFirst,
				'data' => array(
					'1' => Yii::t('messages','Notify when balance is less than') . ' ' . CHtml::textField('balvalue', $balanceValue, array('size'=>10, 'style'=>'z-index:10;')),
					'2' => Yii::t('messages','Notify in one day before the end the promised payment'),
					'3' => Yii::t('messages','Monthly report about personal account state'),
					'4' => Yii::t('messages','Incomming payment')
				),
				'htmlOptions' => array(
					'emptyFor'=> 1 // отправляем (emptyFor => 1) для того чтобы не привязывать клик по lable с установкой селектора
				) 
		    )
		);
		
		/*
		* Блок широковещательных сообщения
		*/

		// Запрашиваем список сообщений (без значений)
		$postsList = $this->lanbilling->get("getSharedPostsCategories", array('flt'=>array()));
		
		// Запрашиваем все установленные значения
		$postsValues = $this->lanbilling->get("getAccountSharedPostCategories", array('flt'=>array()));

		// Отображаем если широковещательные сообщения существуют!
		if(!empty($postsList)) {
			
			// Формируем массив сообщений, пригодный для вывода
			$messages = array();
			foreach($postsList as $key=>$post) {
				$messages[$post->id] = $post->name;
			}
			
			$data[] = array(
				'type' => 'display',
				'value' => Yii::t('messages','Shared posts')
			);
			$data[] = array(
				'type' => 'checkboxlist',
				'name' => 'secondBlock',
				'checked' => $postsValues->categories,
				'data' => $messages, 
				'htmlOptions' => array('emptyFor'=> 1) // отправляем (emptyFor => 1) для того чтобы не привязывать клик по lable с установкой селектора
			);
		}
		
		$data[] = array(
			'type' => 'submit',
			'value' => Yii::t('messages','Save'),
		);
		
		$html = $this->form($data)->method('POST')->render();
		$this->output($html);
    }
	

    public function actions() {
    	$categories = yii::app()->controller->lanbilling->sharedPostsCategories;
    	$actionFile = 'application.components.sharedposts.SharedPosts_Action';
    	$actions = array();
    	foreach ($categories as $category) {
    		$actions['category' . $category->id] = $actionFile;
    	}
    	return $actions;
    }

}
