<script type="text/javascript" src="<?php echo yii::app()->getBaseUrl().'/js/rentSoftAgreementsList.js'; ?>"></script>
<div><?php echo $agreementsListLabel; ?>: <?php echo $agreementsList; ?></div>
<script type="text/javascript">new rentsoftAgreementsList({<?php echo $rentSoftOfAgreementUrls; ?>});</script>
<?php echo $iframe; ?>
