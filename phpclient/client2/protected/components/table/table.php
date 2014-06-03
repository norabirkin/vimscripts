<?php if ($title) { ?>
<h4 <?php if ($margin_top) { ?>
    style="margin-top: <?php echo $margin_top; ?>px;"<?php } ?>
>
    <?php echo $title; ?>
</h4>
<?php } ?>
<table class="grid">
    <thead><?php echo $head; ?></thead>
    <tbody><?php echo $body; ?></tbody>
</table>
<?php echo $pager; ?>
