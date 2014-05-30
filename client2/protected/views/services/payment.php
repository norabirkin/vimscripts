<h1><?php echo yii::t('tariffs_and_services','BalanceRefill'); ?></h1>
<div><?php echo yii::t('tariffs_and_services','LowBalance'); ?> <strong><?php echo Yii::app()->session->get('service_tarname'); ?></strong></div>
<div><?php echo yii::t('tariffs_and_services','GoToPaymentPage'); ?> <?php echo CHtml::link(yii::t('tariffs_and_services','Link'),array('payment/index')); ?>.</div>