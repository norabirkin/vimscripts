<?php if ($limitSelectOnly) { ?>
<div>
    <div style="float: left; line-height: 24px;">
    <?php echo yii::t('main', 'Page limit'); ?> -
    </div>
<?php
     echo yii::app()->controller->renderPartial('application.components.agreements.page_limit', array(
        'limit' => $limit,
        'style' => 'float: left;'
    ), true);
?>
<div style="clear:both;"></div>
</div>
<?php } else { ?>
<div class="pager">
    <ul class="yiiPager">
        <li class="first<?php echo $first_hidden; ?>">
            <a <?php if ($first_href) { ?>href="<?php echo $first_href; ?>" <?php } ?>class="vgroups-pager-link vgroups-pager-link-first">&lt;&lt; Первая</a>
        </li>
        <li class="previous<?php echo $previous_hidden; ?>">
            <a <?php if ($previous_href) { ?>href="<?php echo $previous_href; ?>" <?php } ?>class="vgroups-pager-link vgroups-pager-link-previous">&lt; Предыдущая</a>
        </li>
        <?php foreach ($pages as $page) { ?>
        <li class="page<?php echo $page["page_selected"]; ?>">
            <a <?php if ($page["page_href"]) { ?>href="<?php echo $page["page_href"]; ?>" <?php } ?>class="vgroups-pager-link vgroups-pager-link-page"><?php echo $page["page_number"]; ?></a>
        </li>
        <?php } ?>
        <li class="next<?php echo $next_hidden; ?>">
            <a <?php if ($next_href) { ?>href="<?php echo $next_href; ?>" <?php } ?>class="vgroups-pager-link vgroups-pager-link-next">Следующая &gt;</a>
        </li>
        <li class="last<?php echo $last_hidden; ?>">
            <a <?php if ($last_href) { ?>href="<?php echo $last_href; ?>" <?php } ?>class="vgroups-pager-link vgroups-pager-link-last">Последняя &gt;&gt;</a>
        </li>
        <?php if ($showLimitSelect) { ?>
        <li>
        <?php
            echo yii::app()->controller->renderPartial('application.components.agreements.page_limit', array(
                'limit' => $limit
            ), true);
        ?>
        </li>
        <?php } ?>
    </ul>
</div>
<div class="summary">Элементы <?php echo $first_element_on_page_index; ?>—<?php echo $last_element_on_page_index; ?> из <?php echo $total; ?>.</div>
<?php } ?>
