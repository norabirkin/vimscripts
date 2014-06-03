<h1><?php echo $title; ?></h1>
<?php echo CHtml::beginForm($actionURL); ?>
<?php echo $TVChannelsToUpdateHiddenFields; ?>
<?php echo $TVChannelsToAssignGrid; ?>
<?php echo $TVChannelsToStopGrid; ?>
<?php echo CHtml::submitButton(Yii::t('DTVModule.smartcards', 'Confirm')); ?>&nbsp;
<?php echo $backLink; ?>
<?php CHtml::endForm(); ?>