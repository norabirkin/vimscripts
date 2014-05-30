<?php

class SharedPosts_Action extends CAction {

	public function run()
	{
		$id = str_replace("category", "", $this->getId());
		$posts = yii::app()->lanbilling->get('getClientSharedPosts', array( 
			 'flt' => array (
			 		"userid" => Yii::app()->user->getId(),
                    'status' => 1,
			 		"category" => $id
			 )
		));
		$posts = $this->toArray($posts);
		
		if(count($posts) == 0){
			$this->getController()->output(Yii::t("messages","Messages list is empty"));
			die();
		}
		
		$toRender = '';
		foreach ($posts as $post) {
			$params = array(
					'model'=> '',
					'posttime' => $this->date($post->posttime),
					'text' => $post->text
			);
			$toRender = $this->getController()->renderPartial('messageRow', $params, true) . $toRender;
		}
		
		$this->getController()->output($toRender);
	}
	
	public function toArray($data) {
		if(getType($data) == 'object') {
			$data = array(
				'0' => $data
			);
		}
		
		if(getType($data) == 'NULL') {
			$data = array();
		}
		return $data;
	}
	

	protected function date($date) {
		if ($date == '0000-00-00 00:00:00' OR $date == '0000-00-00' OR !$date) {
			return '---';
		}
		return yii::app()->controller->formatDate(strtotime($date));
	}
}

?>
