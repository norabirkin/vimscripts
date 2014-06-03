<?php class LoginFormWidget extends CWidget {
	public $model;
	protected function getView() {
        return MainTemplateHelper::GetInstance()->GetTheme()->GetLoginFormTemplate();
    }
	private function getCaptcha() {
		if (!yii::app()->params["use_captcha"]) return "";
		$captcha = new Kcaptcha;
		$image = $captcha->get();
		yii::app()->user->setState( "captcha", $captcha->getRandomString() );
		return 'data:image/png;base64,'.$image;
	}
	public function run() {
		if ($view = $this->getView()) $this->render($view, array(
			'loginLabel' => CHtml::activeLabel($this->model, 'login'),
			'loginInput' => CHtml::activeTextField($this->model, 'login', array('size'=>60,'maxlength'=>60,'tabindex'=>1)),
			'passwordLabel' => CHtml::activeLabel($this->model, 'password'),
			'passwordInput' => CHtml::activePasswordField($this->model, 'password', array('size'=>60,'maxlength'=>60,'tabindex'=>2)),
			'submitButton' => CHtml::submitButton(Yii::t('login', 'Enter'),array('tabindex'=>3)),
			'captchaLabel' => CHtml::activeLabel($this->model, 'captcha'),
			'captchaInput' => CHtml::activeTextField($this->model, 'captcha'),
			'captchaImg' => CHtml::image($this->getCaptcha()),
			'use_captcha' => yii::app()->params["use_captcha"]
		));
	}
} ?>
