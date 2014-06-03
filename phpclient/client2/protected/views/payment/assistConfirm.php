<?php $this->widget('LB.widgets.BootAlert'); ?>
<h1><?php echo $title; ?></h1>
<?php if ($data) foreach ($data as $k => $v) { ?>
<div class="form-line">
	<?php echo $k; ?>:
	<strong><?php echo $v ?></strong>
</div>
<?php } ?>
<?php if ($form) { ?><div><?php echo $form; ?></div><?php } ?>
