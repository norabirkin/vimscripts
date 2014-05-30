<h1><?php echo $title; ?></h1>
<?php $this->widget('LB.widgets.BootAlert'); ?>
<?php echo CHtml::beginForm($actionURL); ?>
<?php echo $personalTVGrid; ?>
<?php echo CHtml::submitButton(Yii::t('DTVModule.smartcards', 'Apply')); ?>&nbsp;
<?php echo $backLink; ?>
<?php echo CHtml::hiddenField('vgid',$vgid); ?>
<?php CHtml::endForm(); ?>
