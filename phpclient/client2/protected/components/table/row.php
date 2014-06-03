<tr class="<?php echo $class; ?>">
    <?php $first = true; foreach( $columns as $column ) { ?>
    <td<?php if ($first) { ?> class="first_col"<?php } ?>><?php echo $column; ?></td>
    <?php $first = false; } ?>
</tr>
