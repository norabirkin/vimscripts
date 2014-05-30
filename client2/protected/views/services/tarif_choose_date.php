<?php echo CHtml::beginForm(); ?>
    <?php echo $errors; ?>
    <div class="form-line">
        <?php echo Yii::t('Services','Выбранный тарифный план: '); ?>
        <strong><?php echo $tarname; ?></strong>
    </div>
    <div class="form-line"><?php echo $introMessage; ?></div>
    <div  class="form-line">
        <strong><?php echo Yii::t('Services', 'Дата смены тарифного плана'); ?>:</strong>&nbsp;<?php echo $date_picker; ?>
        <span class="hint">(гггг-мм-дд).</span>
    </div>
    <div class="form-line">
        <?php echo CHtml::submitButton(Yii::t('Services', 'Сменить')); ?>
    </div>
<?php echo CHtml::endForm(); ?>