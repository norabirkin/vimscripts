<div class="sidebar-nav">
    <div class="sidebar-nav-title">
        <strong>
            <?php echo Yii::t('menu', 'ClientAccount') ?>
        </strong>
    </div>
    <?php echo $component->render('items', array('items' => $items)) ?>
</div>
