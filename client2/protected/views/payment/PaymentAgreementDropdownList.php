<label class="form-label"><?php echo Yii::t('payment', 'PaymentReceiver') ?>:</label>
<?php echo $dropdownList; ?>
<?php echo $script; ?>
<span class="form-note"><?php echo Yii::t('payment', 'Balance') ?>: <span id="agreement-balance"><?php echo $balance ?></span></span>