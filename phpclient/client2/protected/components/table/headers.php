<tr class="grid-head">
    <?php $first = true; foreach( $columns as $column ) { ?>
    <th<?php if ($column['width']) { ?> width="<?php echo $column['width']; ?>"<?php } ?><?php if ($first) { ?> class="first_col"<?php } ?>><?php echo $column['title']; ?></th>
    <?php $first = false; } ?>
</tr>
