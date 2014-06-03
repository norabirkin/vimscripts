<h1><?php echo Yii::t('settings', 'Settings') ?></h1>
<?php
//if ($this->error){
//	$this->widget('LB.widgets.BootAlert');
//} else {

?>

<script type='text/javascript'>
    $(document).ready(function(){
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                $('#save-btn').click(function(){
                        if($('#email').val() && !re.test($('#email').val())){
                                alert('Укажите валидный email!');
                                return false;
                        }
                        return true;
                });
        });
</script>



	<?php if (!empty($this->message)) { ?>
	<div class="page-message active"><?php echo $this->message ?> <a href="#" onclick="this.parentNode.style.display='none';return false;" class="page-message-close"></a><span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span></div>
	<?php } ?>



<?php if ($this->lanbilling->clientInfo->account->type == 2) { ?>
	<h2><?php echo Yii::t('settings', 'AccountPersonal') ?></h2>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountFullName') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->name ?></span></div>
<?php if (yii::app()->params['showPersonalData']) { ?>
<?php if ($this->lanbilling->clientInfo->account->birthdate && $this->lanbilling->clientInfo->account->birthdate != '0000-00-00') { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountBirthDate') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->birthdate ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->birthplace) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountBirthPlace') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->birthplace ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->passsernum) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountPassportS') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->passsernum ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->passno) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountPassportN') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->passno ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->passissuedate && $this->lanbilling->clientInfo->account->passissuedate != '0000-00-00') { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountPassportDate') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->passissuedate ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->passissuedep) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountPassportIssued') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->passissuedep ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->inn) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountINN') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->inn ?></span></div>
<?php } ?>
<?php } ?>
<?php } else { ?>
	<h2><?php echo Yii::t('settings', 'AccountCompany') ?></h2>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyName') ?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->name ?></span></div>
<?php if ($this->lanbilling->clientInfo->account->inn) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyInn')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->inn ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->kpp) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyKpp')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->kpp ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->ogrn) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyOgrn')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->ogrn ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->okpo) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyOkpo')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->okpo ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->okved) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyOkved')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->okved ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->getndiru) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyGendirru')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->gendiru ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->glbuhgu) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyGlbuhgu')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->glbuhgu ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->bankname) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyBank')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->bankname ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->bik) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyBIK')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->bik ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->settl) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyAccount')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->settl ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->corr) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyAccountBank')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->corr ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->treasuryname) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyTreasury')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->treasuryname ?></span></div>
<?php } ?>
<?php if ($this->lanbilling->clientInfo->account->treasuryaccount) { ?>
	<div class="form-line"><span class="form-label"><?php echo Yii::t('settings', 'AccountCompanyTreasuryNumber')?></span> <span class="input-text-readonly"><?php echo $this->lanbilling->clientInfo->account->treasuryaccount ?></span></div>
<?php } ?>
<?php } ?>
	<!--<p><?php echo Yii::t('settings', 'AccountChange1') ?> <a href="<?php echo $this->createUrl('support/add');?>"><?php echo Yii::t('settings', 'AccountChange2') ?></a> <?php echo Yii::t('settings', 'AccountChange3') ?></p>-->

<form action="<?php echo $this->createUrl('account/settings');?>">
<div class="account-list">
	<ul class="account-list-titles">
		<li class="selected"><?php echo Yii::t('settings', 'AccountContact')?> <span class="cwt c8 b1"><span class="ctl"></span><span class="ctr"></span></span></li>
		<?php /*
		<li><?php echo Yii::t('settings', 'AccountNotifications') ?> <span class="cwt c8 b1"><span class="ctl"></span><span class="ctr"></span></span></li>
			  */ ?>
		<?php if (yii::app()->params['menu_password']) : ?>
		   <li><?php echo Yii::t('settings', 'AccountPasswordTitle');?> <span class="cwt c8 b1"><span class="ctl"></span><span class="ctr"></span></span></li>
		<?php endif;?>
	</ul>

	<ul class="account-list-fields">
		<li class="selected">
			<div class="form-line"><label class="form-label" for="email"><?php echo Yii::t('settings', 'AccountEmail') ?></label> <input type="text" class="input-text" name="email" id="email" value="<?php echo $this->lanbilling->clientInfo->account->email ?>"></div>
			<?php if (yii::app()->params["allow_edit_phone"]) { ?><div class="form-line"><label class="form-label" for="phone"><?php echo Yii::t('settings', 'AccountPhone')?></label> <input type="text" class="input-text" name="phone" id="phone" value="<?php echo $this->lanbilling->clientInfo->account->phone ?>"><span class="form-note"><?php echo Yii::t('settings', 'AccountPhoneHint') ?></span></div><?php } ?>
		</li>
		<?php /*
		<li>
		    <?php if(is_array($this->lanbilling->subscriptions) && count($this->lanbilling->subscriptions)):?>
				<?php foreach ($this->lanbilling->subscriptions as $subscription) { ?>
				<?php if(is_object($subscription) && isset($subscription->category)):?>
 				   <div class="form-line"><label class="form-label-block"><input type="checkbox" class="input-checkbox" name="category[<?php echo $subscription->category ?>]"<?php echo $subscription->enabled ? ' checked' : ''?>> <?php echo $subscription->title ?></label></div>
				<?php endif;?>
				<?php } ?>
			<?php endif;?>
		</li>PersonalAccount
		*/ ?>

		<?php if (yii::app()->params['menu_password']) : ?>
			<li>
			<div class="form-line"><label class="form-label" for="currpassword"><?php echo Yii::t('settings', 'CurrentPassword') ?></label><input type="password" class="input-text" name="currpass" id="currpassword"></div>
			<div class="form-line"><label class="form-label" for="password"><?php echo Yii::t('settings', 'AccountPassword') ?></label><input type="password" class="input-text" name="pass" id="password"><span class="form-note"><?php echo Yii::t('settings', 'AccountPasswordHint') ?></span></div>
			<div class="form-line"><label class="form-label" for="passwordrepeat"><?php echo Yii::t('settings', 'AccountPasswordRepeat') ?></label><input type="password" class="input-text" name="confirm" id="passwordrepeat"></div>
			</li>
		<?php endif;?>
	</ul>
</div>
<div>
<input type="hidden" name="r" value="account/settings">
<input type="submit" class="input-submit" id='save-btn' value="<?php echo Yii::t('settings', 'Save')?>" name="submit"></div>
</form>
<?php
//}
?>
