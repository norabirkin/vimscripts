<?php class TVChannelsToUpdateHiddenFields extends CApplicationComponent {
	private $assignCount = 0;
	private $stopCount = 0;
	public function Output($data) {
		$hiddenFields =  CHtml::hiddenField('vgid', yii::app()->request->getParam('vgid',0));
		foreach ($data as $service) {
			if ($service->assigned) {
				$hiddenFields .= CHtml::hiddenField('stop['.$this->stopCount.'][catidx]', $service->catidx);
				$hiddenFields .= CHtml::hiddenField('stop['.$this->stopCount.'][servid]', $service->servid);
				$this->stopCount ++;
			} else {
				$hiddenFields .= CHtml::hiddenField('assign['.$this->assignCount.'][catidx]', $service->catidx);
				$hiddenFields .= CHtml::hiddenField('assign['.$this->assignCount.'][servid]', $service->servid)	;
				$this->assignCount ++;
			}
		}
		return $hiddenFields;
	}
} ?>