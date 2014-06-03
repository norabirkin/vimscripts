<select class="paging-limit"<?php if ($style) { ?> style="<?php echo $style; ?>"<?php } ?>>
    <?php foreach (yii::app()->params['paging']['limit_select'] as $v) { ?>
    <option <?php if ($v == $limit) { ?>selected <?php } ?>value="<?php echo $v; ?>"><?php echo $v; ?></option>
    <?php } ?>
</select>
