<br />
<h4 class="relative"><?php echo $agreement; ?>
<?php if($balance) { ?>
	<a href="<?php echo $this->createUrl('payment/index',array('id'=>$agreement->agrmid));?>" class="content-header-side">
    	<?php echo Yii::t('tariffs_and_services', 'Balance'); ?>:&nbsp;<span><?php echo Yii::app()->NumberFormatter->formatCurrency($balance, Yii::app()->params['currency']); ?></span>
    </a>
<?php } ?>
</h4>
<?php echo $grid; ?>