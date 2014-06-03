<div class="form-line"><?php echo Yii::t('payment', 'LimitationOfPromisedPayment') . ': ' .  $maximalAmount; ?></div>
<div class="form-line"><?php echo Yii::t('payment', 'DebtMustBeRepaidBy') . $lastPaymentDay; ?></div>
<div class="form-line"><?php echo yii::t('payment', 'MinimumPayment'); ?>: <?php echo $minimalAmount;?></div>
<div class="form-line">
	<label class="form-label" for="promised_sum"><?php echo Yii::t('payment', 'PaymentSum'); ?>:</label>
    <input  class="input-text input-text-promised" name="promised_sum[]" id="promised_sum_agrm_<?php echo $agrmid; ?>" value="<?php echo $sum; ?>" />
   	<span class="form-note"><?php echo $currencySymbol; ?></span>
    <input type="hidden" name="promised_agrm[]" value="<?php echo $agrmid; ?>">
</div>
<div class="form-line">
	<input type="submit" class="input-submit promised-btn" id='agrm_<?php echo $agrmid; ?>'  value="<?php echo Yii::t('payment', 'Pay'); ?>" />
</div>