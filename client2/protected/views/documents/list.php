<!--  <h1><?php echo yii::t('documents','Documents'); ?></h1>  -->
<?php echo $filter; ?>
<h4><?php 
	if($agreement) echo yii::t('documents', 'DocumentsOfAgreement') . ' ' . $agreement;
	else echo yii::t('documents', 'UnpayedOrders'); 
?></h4>
<?php echo $grid; ?>