<h1><?php echo Yii::t('login', 'PasswordRestore') ?></h1>
<?php $this->widget('LB.widgets.BootAlert'); ?>
<form action="<?php $this->createUrl('site/restore');?>">
	<div class="form-line"><label class="form-label"><?php echo Yii::t('login', 'Login') ?><br/><input type="text" class="input-text" name="login"></label></div
	<div><input type="hidden" name="r" value="site/restore"><input type="submit" class="input-submit" value="<?php echo Yii::t('login', 'Restore') ?>"></div>
</form>
