<tr class="donthighlight">
<?php $first = true; foreach( $columns as $column ) { ?>
	<th<?php if ($first) { ?> class="first_col"<?php } ?>><?php echo $column; ?></th>
<?php $first = false; } ?>
</tr>
<?php echo $rows; ?>
