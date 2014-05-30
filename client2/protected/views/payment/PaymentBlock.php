<?php if ($Description) { ?><div class="payment_title"><?php echo $Title ?></div><?php } ?>
<?php if ($Description) { ?><div><?php echo $Description; ?></div><?php } ?>
<dt class="emphasized <?php echo $paymentTypeCode; ?><?php echo $SelectedClassOrEmptyString; ?>">
	<div class="payment_methods_btns">
		<span class="order_service"><?php if ($Description) echo Yii::t('payment', 'OrderService'); else echo $Title; ?></span>
		<span class="next"> »</span>
	</div>
	<dd<?php echo $SelectedClassOrEmptyString ? ' class="' . $SelectedClassOrEmptyString . '"' : ''; ?>><?php echo $Content; ?></dd>
</dt>