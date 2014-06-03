<h1><?php echo yii::t('ZKH', 'Confirm'); ?></h1>
<h4><small><?php echo yii::t('ZKH', 'Device'); ?>:</small> <?php echo $device; ?></h4>

<div><strong><?php echo yii::t('ZKH', 'Serial'); ?>:</strong> <?php echo ($serial ? $serial : yii::t('ZKH', 'NoSerial')); ?></div>
<div><strong><?php echo yii::t('ZKH', 'ServiceDescription'); ?>:</strong> <?php echo $servicename; ?></div>
<div><strong><?php echo yii::t('ZKH', 'LastRegistration'); ?>:</strong> <?php echo $lastvalue; ?></div>
<div><strong><?php echo yii::t('ZKH', 'CurrentRegistration'); ?>:</strong> <?php echo $currentvalue; ?></div>
<div><strong><?php echo yii::t('ZKH', 'Consumption'); ?>:</strong> <?php echo $consumption; ?></div>
<div><strong><?php echo yii::t('ZKH', 'Cost'); ?>:</strong> <?php echo Yii::app()->NumberFormatter->formatCurrency($cost, Yii::app()->params["currency"]); ?></div>
<div><strong><?php echo yii::t('ZKH', 'Total'); ?>:</strong> <?php echo Yii::app()->NumberFormatter->formatCurrency($sum, Yii::app()->params["currency"]); ?></div>
<br />
<?php echo CHtml::beginForm($this->createUrl('zkh/save')); ?>
<?php echo CHtml::hiddenField('vgid', $vgid); ?>
<?php echo CHtml::hiddenField('catidx', $catidx); ?>
<?php echo CHtml::hiddenField('registration', $currentvalue); ?>
<?php echo CHtml::hiddenField('registrationDate', $currentRegistrationDate); ?>
<?php echo CHtml::hiddenField('sum', $sum); ?>
<?php echo Chtml::submitButton(yii::t('ZKH','confirmButton')) ?>
<?php echo CHtml::endForm(); ?>