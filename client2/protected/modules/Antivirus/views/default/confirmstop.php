<h1><?php echo $title; ?></h1>
<div><?php echo $message; ?></div>
<br />
<form method="post" action="<?php echo $url; ?>" >
	<input type="submit" value="<?php echo yii::t( Antivirus::getLocalizeFileName(), "Confirm" ); ?>" />
</form>
