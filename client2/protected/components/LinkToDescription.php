<?php class LinkToDescription extends CWidget {
	public $link;
	private function GetLinkImage() {
		return CHtml::image(Yii::app()->theme->baseUrl.'/i/b_info.gif','info');
	}
	public function run() {
		if ($this->link) echo '&nbsp;&nbsp;'.CHtml::link($this->GetLinkImage(),$this->link,array('class' => 'no_border'));
		else echo '';
	}
} ?>