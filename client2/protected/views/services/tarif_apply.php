<?php echo CHtml::beginForm(); ?>
    <?php echo CHtml::errorSummary($model,'<strong>'.Yii::t('Services', 'Внимание! При проверке возникли ошибки:').'</strong>','',array('class'=>'alert alert-error')); ?>
<?php foreach ($data as $v) { ?>
    <div class="form-line">
    <?php if ($v) { if (is_scalar($v)) { echo $v; } else { ?>
        <?php echo $v['label']; ?>:
        <?php if ($v['value']) { ?><strong><?php echo $v['value']; ?></strong><?php } ?>
        <?php if ($v['date']) { echo $v['date']; ?>&nbsp;<span class="hint">(гггг-мм-дд).</span><?php } ?>
    <?php } } ?>
    </div>
<?php } ?>
    <div class="form-line">
        <?php foreach ($hidden as $v) echo CHtml::activeHiddenField($model,$v); ?>
        <?php echo CHtml::submitButton(Yii::t('Services', $button_text)); ?>&nbsp;&nbsp;&nbsp;
        <?php echo CHtml::link(Yii::t('tariffs_and_services', 'Back'), array($back_link)); ?>
    </div>
<?php echo CHtml::endForm(); ?>