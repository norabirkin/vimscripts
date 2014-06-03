
<script type='text/javascript'>
    $(document).ready(function(){
		// $('input.input-date-min').datepicker({ minDate: new Date() });
		$('input.input-date-min').datepicker({ minDate: '<?php echo $date; ?>' });
	});
</script>

<div class="popup-content">

<p class="note"><?php echo Yii::t('app', 'PaymentAgreement') ?> <strong><?php echo $this->lanbilling->Operators[$this->lanbilling->agreements[$this->lanbilling->Tarif->vgroup->agrmid]->operid]['name'] ?> <?php echo $this->lanbilling->agreements[$this->lanbilling->Tarif->vgroup->agrmid]->number ?></strong>, <?php echo Yii::t('app', 'PaymentAccount') ?> <strong><?php echo $this->lanbilling->Tarif->vgroup->agentdescr ?> <?php echo $this->lanbilling->Tarif->vgroup->login ?></strong></p>

<form action="<?php echo $this->createUrl('services/options',array('id' => $this->id));?> method="post">
<div class="tariff-info">

	<h2><?php echo Yii::t('app', 'ServiceOptions') ?> <span class="content-header-side"><a href="<?php echo $this->createUrl('history/index',array('service' => 3, 'agreement' => $this->lanbilling->Tarif->vgroup->agrmid, 'vgid' => $this->lanbilling->Tarif->vgroup->vgid))?>"><?php echo Yii::t('app', 'History') ?></a></span></h2>
	<table class="content-table">
<?php foreach ($this->lanbilling->Tarif->services as $service) { ?>
	<?php if (empty($service->archive) && !empty($service->available)) { ?>
	<tr>
		<td><label for="catidx<?php echo $service->catidx ?>"><?php echo $service->descr ?></label></td>
		<td><?php echo empty($service->descrfull) ? '' : $service->descrfull ?></td>
		<td width="40"><input type="checkbox" id="catidx<?php echo $service->catidx ?>" name="catidx[<?php echo $service->catidx ?>]" <?php echo $service->enabled? " checked" : ''?>></td>
	</tr>
	<?php } ?>
<?php } ?>
	</table>

	<p class="popup-submit"><input type="submit" class="input-submit" value="<?php echo Yii::t('app', 'SaveChanges') ?>" name="submit"> <a class="input-cancel" href="#"><?php echo Yii::t('app', 'Cancel') ?></a></p>

</div>
</form>

</div>
