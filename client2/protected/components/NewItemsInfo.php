<?php abstract class NewItemsInfo extends CWidget {
	public function run() {
		if (!$this->GetMessagesCount()) return;
		$this->render('ClientInfoMessage', array(
			'messagesCount' => $this->GetMessagesCount(),
			'messagesDescription' => $this->GetMessagesDescription(),
			'detailsUrl' => $this->GetDetailsUrl()
		));
	}
	protected function GetMessagesDescription() {
		return yii::t( 'main', $this->GetLocalizationKey() );
	}
	abstract protected function GetDetailsUrl();
	abstract protected function GetMessagesCount();
	abstract protected function GetLocalizationKey();
} ?>