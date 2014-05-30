<h1><?php echo yii::t('ZKH', 'Registration'); ?></h1>
<h4><small><?php echo yii::t('ZKH', 'Device'); ?>:</small> <?php echo $device; ?></h4>

<div><strong><?php echo yii::t('ZKH', 'Serial'); ?>:</strong> <?php echo ($serial ? $serial : yii::t('ZKH', 'NoSerial')); ?></div>
<div><strong><?php echo yii::t('ZKH', 'ServiceDescription'); ?>:</strong> <?php echo $servicename; ?></div>
<div><strong><?php echo yii::t('ZKH', 'Above'); ?>:</strong> <?php echo Yii::app()->NumberFormatter->formatCurrency($cost, Yii::app()->params["currency"]); ?></div>
<?php if ($lastdate AND $lastvalue) { ?>
<div><strong><?php echo yii::t('ZKH', 'LastRegistrationDate'); ?>:</strong> <?php echo yii::app()->controller->formatDate(strtotime($lastdate)); ?></div>
<div><strong><?php echo yii::t('ZKH', 'LastRegistration'); ?>:</strong> <?php echo $lastvalue; ?></div>
<?php } ?>
<br />
<?php echo CHtml::beginForm($this->createUrl('zkh/confirm')); ?>
<table style="width:auto;">
	<tr><td><strong><?php echo yii::t('ZKH', 'CurrentRegistrationDate'); ?>:</strong></td><td>&nbsp;&nbsp;<?php echo datepicker::get(array('model' => (new ZKHModel), 'attribute' => 'registrationDate')); ?>&nbsp;<span class="hint">(гггг-мм-дд).</span></td></tr>
	<tr><td><strong><?php echo yii::t('ZKH', 'CurrentRegistration'); ?>:</strong></td><td>&nbsp;&nbsp;<?php echo CHtml::textField('registration'); ?></td><tr>
</table>
<?php echo CHtml::hiddenField('vgid', $vgid); ?>
<?php echo CHtml::hiddenField('catidx', $catidx); ?>
<?php echo Chtml::submitButton('OK') ?>
<?php echo CHtml::endForm(); ?>