<?php
$this->pageTitle = Yii::app()->name.' - '.Yii::t('TurboModule.Turbo', 'Error');
?>
<h3><?php echo Yii::t('TurboModule.Turbo', 'Error'); ?></h3>
<?php echo $error; ?>
<p>
    <?php echo CHtml::link(Yii::t('TurboModule.Turbo', 'Return to the start page'), array('/turbo')); ?>
</p>