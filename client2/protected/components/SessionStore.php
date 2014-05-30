<?php class SessionStore extends CApplicationComponent {
	public function get($attribute,$namespace,$default = 0) {
		$value = $default;
		if (!Yii::app()->request->getParam('clear',0)) {
			$value = Yii::app()->request->getParam($attribute,$default);
        	if (Yii::app()->session->contains($namespace.'_'.$attribute)) {
        		if (isset($_REQUEST[$attribute]) && $value != Yii::app()->session->get($namespace.'_'.$attribute)) {
            		Yii::app()->session->remove($namespace.'_'.$attribute);
                	Yii::app()->session[$namespace.'_'.$attribute] = $value;
            	} else {
            		$value = Yii::app()->session->get($namespace.'_'.$attribute);
            	}
        	} else {
        		if ($value) Yii::app()->session[$namespace.'_'.$attribute] = $value;
        	}
		}
		return $value;
	}
} ?>