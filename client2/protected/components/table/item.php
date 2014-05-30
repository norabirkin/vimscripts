<?php if ($title) { ?>
<tr class="grid-head">
    <td colspan="<?php echo $colspan; ?>">
        <h4 class="relative"<?php if ($margin_top) { ?>
            style="margin-top: <?php echo $margin_top; ?>px;"<?php } ?>
        >
            <?php echo $title; ?>
        </h4>
    </td>
</tr>
<?php } elseif ($margin_top) { ?>
<tr class="grid-head" style="height: <?php echo $margin_top; ?>px;">
    <td colspan="<?php echo $colspan; ?>"></td>
</tr>
<?php } ?>
<?php echo $head; ?>
<?php echo $body; ?>
<?php if ($pager) { ?>
<tr class="grid-head">
    <td colspan="<?php echo $colspan; ?>">
        <?php echo $pager; ?>
    </td>
</tr>
<?php } ?>
