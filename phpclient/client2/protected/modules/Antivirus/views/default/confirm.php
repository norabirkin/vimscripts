<h1><?php echo $title; ?></h1>
<div><?php echo $message; ?></div>
<br />
<div><?php echo $license; ?></div>
<div style="line-height: 18px;">
	<?php echo $agree; ?>
	<input id="lbantivirus_confirm_agreecheckbox" type="checkbox" />
</div>
<br />
<form method="post" action="<?php echo $url; ?>" >
	<input id="lbantivirus_confirm_submit" class="disabled" disabled="" type="submit" value="<?php echo yii::t( Antivirus::getLocalizeFileName(), "Confirm" ); ?>" />
</form>
