<?php class ServiceFunctionWidgets {
	public function GetServiceFunctions() {
		$html = '';
		if($result = yii::app()->controller->lanbilling->getRows('getClientServFuncs')) {
			foreach ($result as $serviceFunction) {
				$item = $this->GetServiceFunctionWidget(trim($serviceFunction->savedfile));
				if ($item) $html .= '<div class="service-function">' . $item . '</div>';
			}
		}
		return $html;
	}
	protected function GetServiceFunctionWidget($savedfile) {
		switch ($savedfile) {
			case 'iframe_turbo_btn' : 
				return CHtml::link('<img src="'.Yii::app()->baseUrl.'/i/turbo.jpg" />', array('internet/turbo'));
				break;
		}
		return '';
	}
} ?>
