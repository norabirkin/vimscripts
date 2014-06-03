<?php if($title) { ?>
<tr class="donthighlight">
	<td class="gridtitle" colspan="<?php echo $columnscount; ?>">
		<h4><?php echo $title; ?></h4>
	</td>
</tr>
<?php } ?>
<?php echo $rows; ?>
<tr class="gridgroupspacer donthighlight">
	<td colspan="<?php echo $columnscount; ?>"></td>
</tr>
