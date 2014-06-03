<h1><?php echo Yii::t('login', 'AccountEnter') ?></h1>
<p><?php echo Yii::t('login', 'AccountEnterAbout') ?></p>

<?php $this->widget('LB.widgets.BootAlert'); ?>

<?php echo CHtml::beginForm(); ?>
<?php echo CHtml::errorSummary($model); ?>

<?php $this->widget('LoginFormWidget', array('model' => $model)); ?>

<?php echo CHtml::endForm(); ?>
<?php if (yii::app()->params['showRestorePassword']) { ?><p style="clear:both;"><a href="<?php echo $this->createUrl('site/restore');?>"><?php echo Yii::t('login', 'RestorePassword'); ?></a></p><?php } ?>
