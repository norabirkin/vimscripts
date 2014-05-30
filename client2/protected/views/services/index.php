
<div class="contract-list">

<?php if (!empty($this->message)) { ?>
<div class="page-message active"><?php echo $this->message ?> <a href="#" onclick="this.parentNode.style.display='none';return false;" class="page-message-close"></a><span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span></div>
<?php } ?>


<?php $this->widget('LB.widgets.BootAlert'); ?>

<?php foreach ($this->lanbilling->agreements as $aid => $agreement) { ?>
	<div class="contract-item">
		<h1><?php echo $this->lanbilling->Operators[$agreement->operid]['name'] ?></h1>
		<h2><?php echo $agreement->number; ?> <a href="<?php echo $this->createUrl('payment/index',array('id'=>$agreement->agrmid))?>" class="content-header-side"><?php echo Yii::t('app', 'Balance') ?>: <span><?php echo round($agreement->balance, 2) ?> <?php echo $agreement->symbol ?></span></a></h2>
		<table class="content-table account-list">
			<tr><th class="account-name"><?php echo Yii::t('app', 'ServiceAccount') ?></th><th class="account-tariff"><?php echo Yii::t('app', 'TarificationUC') ?></th><th class="account-options"><?php echo Yii::t('app', 'ServiceServices') ?></th><th class="account-status"><?php echo Yii::t('app', 'ServiceState')?></th></tr>

<?php foreach ($this->lanbilling->vGroups as $vGroup) { ?>
	<?php if ($vGroup->vgroup->agrmid == $agreement->agrmid) { ?>
			<tr class="account">
				<td>
					<div class="actions-wrap">
					<a href="#"' class="pseudo"><?php echo $vGroup->vgroup->agentdescr . ' ' . $this->convertAgentNumber($vGroup->vgroup) ?> &#9662; </a>
					<div class="actions-list">
						<ul>
						<?php if (!empty($vGroup->tarstaff)) { ?>
							<li><a href="<?php echo $this->createUrl('services/change',array('id' => $vGroup->vgroup->tarifid))?>" class="actions-item popup-tariff-change"><?php echo Yii::t('app', 'ChangeTarification') ?></a></li>
						<?php } ?>
						<?php if (!empty($this->lanbilling->tarifs[$vGroup->vgroup->tarifid]) && !empty($this->lanbilling->tarifs[$vGroup->vgroup->tarifid]->services_count)) { ?>
							<li><a href="<?php echo $this->createUrl('services/options',array('id' => $vGroup->vgroup->tarifid));?>" class="actions-item popup-tariff-change"><?php echo Yii::t('app', 'ServiceOptions') ?></a></li>
						<?php } ?>
							<li><a href="<?php echo $this->createUrl('history/index',array('service' => 1,'agreement' => $agreement->agrmid, 'vgid' => $vGroup->vgroup->vgid))?>" class="actions-item"><?php echo Yii::t('app', 'TarificationHistory') ?></a></li>
							<li><a href="<?php echo $this->createUrl('history/index',array('service' => 3,'agreement' => $agreement->agrmid, 'vgid' => $vGroup->vgroup->vgid))?>" class="actions-item"><?php echo Yii::t('app', 'ServiceHistory') ?></a></li>
						</ul>
					</div>
					</div>
				</td>
				<td><?php echo $vGroup->vgroup->tarifdescr ?></td>
				<td>
					<span class="account-option">
				<?php if (!empty($this->lanbilling->tarifs[$vGroup->vgroup->tarifid]) && !empty($this->lanbilling->tarifs[$vGroup->vgroup->tarifid]->services_count)) { ?>
					<?php foreach ($this->lanbilling->tarifs[$vGroup->vgroup->tarifid]->services as $service) { ?>
					<?php is_object($service) ?  ($service->enabled ? $service->descr . ' ' : '') : $service ?>
					<?php } ?>
				<?php } ?>
					</span>
				</td>
				<td><span class="account-status">
					<?php if (!empty($vGroup->tarrasp)) { ?>
					<?php $rasp = is_array($vGroup->tarrasp) ? $vGroup->tarrasp[0] : $vGroup->tarrasp; ?>
					<?php echo Yii::t('app', 'TarificationChangeRequested'); ?>
						<strong><?php echo empty($rasp->tarnewname) ? $vGroup->vgroup->tarifdescr : $rasp->tarnewname; ?></strong>
						<?php echo Yii::t('app', 'From'); ?>
						<?php echo $this->formatDate(strtotime($rasp->changetime)); ?>
					<?php } ?>
					<br>
					<?php echo Yii::t('app', 'TarificationState'); ?>: <?php echo Yii::t('app', 'AgentState' . $vGroup->vgroup->blocked); ?>
					<?php if ($agreement->date != '0000-00-00' && $agreement->date != '1899-11-30') { ?>
						<?php echo Yii::t('app', 'Till') . ' ' . $this->formatDate(strtotime($agreement->date)); ?>
					<?php } ?>
					<?php if (!$vGroup->vgroup->blocked && empty($vGroup->vgroup->blockrasp)) { ?>
						<a href="<?php echo $this->createUrl('account/index',array('id' => $vGroup->vgroup->vgid, 'action' => 'block'));?>">
							<?php echo Yii::t('app', 'TarificationBlock'); ?>
						</a>
					<?php } elseif ($vGroup->vgroup->blocked == '2' && empty($vGroup->vgroup->blockrasp)) { ?>
						<a href="<?php echo $this->createUrl('account/index',array('id' => $vGroup->vgroup->vgid, 'action' => 'unblock'));?>">
							<?php echo Yii::t('app', 'TarificationActivate'); ?>
						</a>
					<?php } ?>
					<br>
					<?php if ($vGroup->vgroup->tariftype < 5) { ?>
						<?php echo Yii::t('app', 'TarificationConsumed') ?>:
						<?php if ($vGroup->vgroup->tariftype < 2) { ?>
							<?php echo abs(round($vGroup->vgroup->serviceusedin/1024/1024)) ?>/<?php echo $vGroup->vgroup->servicevolume ?> <?php echo Yii::t('app', 'MB') ?>
						<?php } elseif ($vGroup->vgroup->tariftype < 5) { ?>
							<?php echo abs(round($vGroup->vgroup->serviceusedin/60)) ?>/<?php echo $vGroup->vgroup->servicevolume ?> <?php echo Yii::t('app', 'MIN') ?>
						<?php } ?>
					<?php } ?>
					<!-- a href="?r=history/index&id=<?php echo $agreement->agrmid ?>"><?php echo Yii::t('app', 'TarificationStatsLC') ?></a -->
				</span></td>
			</tr>

	<?php } ?>
<?php } ?>

		</table>
	</div>
<?php } ?>

</div>


<?php
/*
<div class="contract">
    <a class="pseudo" href="?r=site/payment&id=<?php $agreement->agrmid ?>" onclick="$(this).parent().parent().next().toggle();return false;"> &#9662;</a>

    <ul class="actions-list">
	<li><a href="?r=site/payment&id=<?php echo $agreement->agrmid ?>"><?php echo Yii::t('app', 'IncreaseBalance') ?></a></li>
	<li><a href="?r=history/index&id=<?php $agreement->agrmid ?>"><?php echo Yii::t('app', 'AgreementStats') ?></a></li>
    </ul>

	<div class="tariff">
			<div class="actions-list">
				<p><?php echo $vGroup->vgroup->tarifdescr ?></p>
				<table width="100%" class="stats">
					<tr><td><?php echo Yii::t('app', 'TarificationFee') ?></td><td><?php echo $vGroup->vgroup->servicerent ?> <?php echo Yii::t('app', 'RUB') ?></td></tr>
		<?php if ($vGroup->vgroup->tariftype < 2) { ?>
					<tr><td><?php echo Yii::t('app', 'TarificationLimitTraffic') ?></td><td><?php echo $vGroup->vgroup->servicevolume ?> <?php echo Yii::t('app', 'MB') ?></td></tr>
		<?php } elseif ($vGroup->vgroup->tariftype < 5) { ?>
                                        <tr><td><?php echo Yii::t('app', 'TarificationLimitTime') ?></td><td><?php echo $vGroup->vgroup->servicevolume ?> <?php echo Yii::t('app', 'MIN') ?></td></tr>
		<?php } ?>
				</table>
			</div>
		<!-- p><?php echo Yii::t('app', 'TarificationServices') ?>:</p>
		<p class="promo-blocks-small"><a href="#"><?php echo Yii::t('app', 'ServiceBooster') ?></a> <a href="#"><?php echo Yii::t('app', 'ServiceSpeedPlus') ?></a></p -->
	</div>

</div>

*/
?>
