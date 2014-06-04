<div class="form-line">
<?php echo $loginLabel; ?>
<?php echo $loginInput; ?>
</div>

<div class="form-line">
<?php echo $passwordLabel; ?>
<?php echo $passwordInput; ?>
</div>

<?php if($use_captcha) { ?>

<div class="form-line">
<?php echo $captchaLabel; ?>
<?php echo $captchaInput; ?>
</div>

<div class="form-line">
<?php echo $captchaImg; ?>
</div>

<?php } ?>

<div>
<?php echo $submitButton; ?>
</div>
