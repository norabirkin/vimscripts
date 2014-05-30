<h4><?php echo $name;?></h4>
<div class="eq-block left_padding">
    <div>
        <strong><?php echo yii::t('main','Serial');?>:</strong> 
        <?php echo $serial;?>
    </div>
    <div>
        <strong><?php echo Yii::t('main','Description');?>:</strong> 
        <?php echo $descr; ?>
    </div>
    <?php if ($message) { ?>
    <div><?php echo $message; ?></div>
    <?php } ?>
</div>
<h5 class="binded-devices"><?php echo yii::t('main','Related equipment'); ?></h5>
<div class="eq_list">
    <?php if ($grid) { echo $grid; } else { ?>
    <div style="margin-bottom:40px; margin-left: 10px;"><?php echo yii::t('main', 'There is no related devices.'); ?></div>
    <?php } ?>
</div>
<div class="joineq"><?php echo $joineq; ?></div>
