<?php if ($label OR $item) { ?>
<tr>
    <?php if ($label) { ?>
    <td style="padding:0 0 10px 0; width: 1px; white-space: nowrap;"><?php echo yii::t('main', $label); ?>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
    <td style="padding:0 0 10px 0;">
        <?php echo $item; ?>
        <?php if ($note) { ?>
            <span class="form-note">
                <?php echo yii::t('main', $note); ?>
            </span>
        <?php } ?>
    </td>
    <?php } else { ?>
    <td<?php if (!$custom) { ?> style="padding:0 0 10px 0;"<?php } ?> colspan="2">
        <?php echo $item; ?>
    </td>
    <?php } ?>
</tr>
<?php } ?>
