<?php if ($label) { ?>
<strong><?php echo $label; ?>:</strong>
<?php } ?>
<?php foreach ($items as $item) { ?>
<?php echo $item->output(); ?>
<?php } ?>