<h1><?php echo Yii::t('DTVModule.equipment','JoinEquipment'); ?></h1>
<div class="page-descr"><?php echo Yii::t('DTVModule.equipment','ChoosenSmartCard'); ?>: <strong><?php echo $cardname; ?></strong></div>
<h4><?php echo Yii::t('DTVModule.equipment','AvailableEquipment'); ?></h4>
<?php echo $grid; ?>