<?php
$currentDate = date("d.m.Y");
$beginningOfYear = "01.01." . date("Y");
?>

<h1><?php echo Yii::t('payment', 'ServicePayment'); ?><?php //echo Yii::t('app', 'Payment'); ?></h1>


<?php if ($this->error){ $this->widget('LB.widgets.BootAlert'); } else { ?>

<form method="post" action="<?php echo $this->createUrl('payment/index');?>" id="payform">

<input type="hidden" name="paytype" value="" id="paytype">

<?php $this->widget('LB.widgets.BootAlert'); ?>

<?php
if (!empty($this->message)) { ?>
<div class="page-message active">
    <?php echo $this->message ?> <a href="#" onclick="this.parentNode.style.display='none';return false;" class="page-message-close"></a>
    <span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span>
</div>
<?php }
?>


<?php if(Yii::app()->user->hasFlash('message')):?>
    <div class="page-message active">
        <?php echo yii::app()->controller->stripTags( Yii::app()->user->getFlash('message') );?>
        <a class="page-message-close" onclick="this.parentNode.style.display='none';return false;" href="#"></a>
        <span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span>
    </div>
<?php endif;?>

<div class="form-line">
</div>

<div class="form-line">
	<?php 
		$sum_and_agrmid = PromisedPaymentLogic::GetSumAndAgrmidFromRequest();
		$first_agreement = $this->lanbilling->agreements[$sum_and_agrmid['agrmid']]; 
	?>
	<?php $this->widget('PaymentAgreementsDropdownList'); ?>
</div>

<!--<p> <a id="get-history" class="emphasized" href="<?php echo $this->createUrl('history/index',array('agreement' => 0, 'dtfrom' => $beginningOfYear,'dtto' => $currentDate, 'service' => 2,'vgid' => 0));?>"><?php echo Yii::t('app', 'PaymentHistory') ?> <span id="payment-history"><?php echo $first_agreement->number ?></span></a> </p> -->

<!--<h2><?php echo Yii::t('app', 'PaymentMethods') ?></h2>-->

<div class="recomended_payment<?php if ($first_agreement->balance < 0) { ?> has_arrears<?php } ?>">
	<?php $rec = 0; if ($first_agreement->balance < 0) $rec = round(( (-1) * $first_agreement->balance), 2); ?>
    <?php echo yii::t('payment','RecommendedAmountForPayment',array('{amount}' => '<strong class="arrears_value">'.$rec.'</strong> '.yii::t('payment', 'Rubles'))); ?>
</div>

<div class="payment-list">
    <div class="payment_title"><?php echo Yii::t('payment', 'BalanceRefill'); ?></div>
            <div>
            		<?php echo yii::app()->params["balance_refill_text"]; ?>
            </div>
    
    <dl class="payment-list-titles">
<?php if (yii::app()->params['payment_internal']) { ?>
<?php //if (defined('PAYMENT_INTERNAL') && PAYMENT_INTERNAL) { ?>
    <dt class="emphasized in<?php echo $action == 'internal' ? ' selected' : '' ?>">
        <div class="payment_methods_btns"><span class="order_service"><?php echo Yii::t('payment', 'InternalPayment'); ?></span><span class="next"> »</span></div>
        <?php //echo Yii::t('app', 'PaymentInternal'); ?> 
    </dt>
        <?php if (yii::app()->params['payment_internal']) { ?>
        <?php //if (defined('PAYMENT_INTERNAL') && PAYMENT_INTERNAL) { ?>
        <dd<?php echo $action == 'internal' ? ' class="selected"' : '' ?>>
            <div class="form-line"><?php echo Yii::t('payment', 'PaymentInternalInfo'); ?></div>
            <div class="form-line"><label class="form-label"><?php echo Yii::t('payment', 'PaymentSum'); ?>:</label><input class="input-text"> <?php echo Yii::t('payment', 'RUB'); ?></div>
            <div class="form-line">
                <label class="form-label"><?php echo Yii::t('payment', 'Agreement'); ?>:</label>
                <select id="payment-agreement-internal">
        <?php foreach ($this->lanbilling->agreements as $id => $agreement) { ?>
            <?php $balance = empty($balance) ? round($agreement->balance, 2) . " " . $agreement->symbol : $balance; ?>
            <?php $agrgroup = empty($agrgroup) ? '' : $agrgroup; ?>
            <?php if ($this->lanbilling->Operators[$agreement->operid]['name'] != $agrgroup) { ?>
                <?php if (!empty($agrgroup)) { ?>
                </optgroup>
                <?php } ?>
                <?php $agrgroup = $this->lanbilling->Operators[$agreement->operid]['name']; ?>
                <optgroup label="<?php echo $this->lanbilling->Operators[$agreement->operid]['name']; ?>">
            <?php } ?>
                    <option value="<?php echo $id; ?>"><?php echo $agreement->number; ?></option>
        <?php } ?>
                    </optgroup>
                </select>
                <span class="form-note"><?php echo Yii::t('payment', 'Balance'); ?>: <span id="agreement-balance-internal"><?php echo $balance; ?></span></span>
            </div>
            <div class="form-line"><input type="submit" class="input-submit" value="<?php echo Yii::t('payment', 'Pay'); ?>"></div>
        </dd>
        <?php } ?>
<?php } ?>
<?php if (yii::app()->params['payment_assist']) echo $AssistPayment; ?>
<?php if (yii::app()->params['payment_yandexmoney']) { ?>
    <dt class="emphasized ym">
        <div class="payment_methods_btns">
            <span class="order_service">
                <?php echo Yii::t('payment', 'YandexMoney'); ?>
            </span>
            <span class="next"> »</span>
        </div>
        <dd>
            <div class="form-line">
                <label class="form-label"><?php echo Yii::t('payment', 'PaymentSum'); ?>:</label>
                <input class="input-text"> <?php echo Yii::t('payment', 'RUB'); ?>
            </div>
            <div class="form-line">
                <input type="submit" class="input-submit" value="<?php echo Yii::t('payment', 'Pay') ?>">
            </div>
        </dd>
<?php } ?>
<?php echo $WebmoneyPayment; ?>
<?php echo $PaymasterPayment; ?>
<?php if (yii::app()->params['payment_qiwi']) { ?>
    <?php //if (defined('PAYMENT_QIWI') && PAYMENT_QIWI) { ?>
        <dt class="emphasized qw">
            <div class="payment_methods_btns">
                <span class="order_service">
                    <?php echo Yii::t('payment', 'QIWI'); ?>
                </span>
                <span class="next"> »</span>
            </div>
            <?php //echo Yii::t('app', 'PaymentQIWI') ?> </dt>
            <?php if (yii::app()->params['payment_qiwi']) { ?>
            <?php //if (defined('PAYMENT_QIWI') && PAYMENT_QIWI) { ?>
            <dd>
                <div class="form-line"><?php echo Yii::t('payment', 'QIWIInfo') ?></div>
            </dd>
            <?php } ?>
    <?php } ?>

    <?php if (yii::app()->params['payment_cards']) { ?>
    <?php //if (defined('PAYMENT_CARDS') && PAYMENT_CARDS) { ?>
        <dt class="emphasized cd<?php echo $action == 'card' ? ' selected' : ''; ?>"><div class="payment_methods_btns"><span class="order_service"><?php echo Yii::t('payment', 'PaymentCard'); ?></span><span class="next"> »</span></div></dt>
            <?php if (yii::app()->params['payment_cards']) { ?>
            <?php //if (defined('PAYMENT_CARDS') && PAYMENT_CARDS) { ?>
            <dd<?php echo $action == 'card' ? ' class="selected"' : ''; ?>>
            <?php if (yii::app()->params['require_card_serial']) { ?>
                <?php //if (defined('REQUIRE_CARD_SERIAL') && REQUIRE_CARD_SERIAL) { ?>
                <div class="form-line">
                    <label class="form-label" for="card_serial"><?php echo Yii::t('payment', 'SerialNumber'); ?>:</label>
                    <input type="text" class="input-text" name="card_serial" id="card_serial" value="<?php echo $serial; ?>">
                    <span class="form-note"><?php echo Yii::t('payment', 'NoSpaces'); ?></span>
                </div>
           <?php } ?>
                <div class="form-line">
                    <label class="form-label" for="card_code"><?php echo Yii::t('payment', 'Code'); ?>:</label>
                    <input type="text" class="input-text" name="card_code" id="card_code" value="<?php echo $code; ?>">
                    <span class="form-note">
                        <?php echo Yii::t('payment', 'NoSpaces'); ?>
                    </span>
                    <input type="hidden" name="card_agrm" value="<?php echo $first_agreement->agrmid; ?>" id="card_agrm">
                </div>
                
                <div class="form-line">
                    <input type="submit" class="input-submit" value="<?php echo Yii::t('payment', 'Pay'); ?>">
                </div>
            </dd>
            <?php } ?>
    <?php } ?>
        <?php if (yii::app()->params['payment_bank']) { ?>
        <?php //if (defined('PAYMENT_BANK') && PAYMENT_BANK) { ?>
        <dt class="emphasized cd<?php echo $action == 'visa' ? ' selected' : '' ?>">
            <div class="payment_methods_btns">
                <span class="order_service">
                    <?php echo Yii::t('payment', 'VISACard'); ?>
                </span>
                <span class="next"> »</span>
            </div>
            <?php //echo Yii::t('app', 'Карта VISA'); ?> </dt>
        <dd<?php echo $action == 'visa' ? ' class="selected"' : '' ?>>
            <div class="form-line">
                <label class="form-label" for="visa_summ"><?php echo Yii::t('payment', 'PaymentSum'); ?>:</label>
                <input type="text" class="input-text" name="visa_summ" id="visa_summ" value="">
            </div>
            <div class="form-line"><input type="submit" class="input-submit" id='visa-pay-btn' value="<?php echo Yii::t('payment', 'Pay') ?>"></div>
        </dd>
        <?php } ?>
<?php echo $PromisedPayment; ?>
    </dl>
</div>
<input type="hidden" class="LMI_PAYMENT_BASE" value="<?php echo Yii::t('payment', 'PaymentByAgreement') . ' '; ?>" />
</form>

<?php } ?>
