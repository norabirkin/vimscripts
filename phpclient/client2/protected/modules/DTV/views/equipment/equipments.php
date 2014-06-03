<h4><?php echo $name;?></h4>
<div class="eq-block left_padding">
	<div>
		<strong><?php echo Yii::t('DTVModule.equipment','Serial');?>:</strong> 
		<?php echo $serial;?>
	</div>
	<div>
		<strong><?php echo Yii::t('DTVModule.equipment','Description');?>:</strong> 
		<span id="editable-value-smartcard-desc-<?php echo $cardid; ?>"><?php echo $descr;?></span>
		<?php echo $carddescedit; ?>
	</div>
    <?php if ($message) { ?>
    <div><?php echo $message; ?></div>
    <?php } ?>
</div>
<h5 class="binded-devices"><?php echo yii::t('DTVModule.equipment','Related equipment'); ?></h5>
<div class="eq_list">
	<?php if ($grid) { echo $grid; } else { ?>
	<div style="margin-bottom:40px; margin-left: 10px;"><?php echo yii::t('DTVModule.equipment', 'There is no related devices.'); ?></div>
	<?php } ?>
</div>
<div class="joineq"><?php echo $joineq; ?></div>
