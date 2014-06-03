<label class="form-label" for="<?php echo $inputElementName; ?>"><?php echo $inputElementLabel ?>:</label>
<?php echo $inputElement; ?>
<?php if($inputElementDescription) { ?>
	<span class="form-note"><?php echo $inputElementDescription; ?></span>
<?php } ?>