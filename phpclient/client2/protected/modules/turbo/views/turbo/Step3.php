<?php
$this->pageTitle = Yii::app()->name.' - '.Yii::t('TurboModule.Turbo', 'Selecting duration');
?>
<?php echo CHtml::beginForm(); ?>
    <?php echo CHtml::errorSummary($model,'<b>'.Yii::t('TurboModule.Turbo', 'Error!').'</b>','',array('class'=>'alert alert-warning')); ?>

    <div>
        <?php echo CHtml::activeLabel($model,'duration'); ?>
        <div>
            <?php echo CHtml::activeTextField($model,'duration'); ?>
        </div>
    </div>
    <div style="padding-top: 10px;">
        <?php echo CHtml::submitButton(Yii::t('TurboModule.Turbo', 'Purchase')); ?>
    </div>
<?php echo CHtml::endForm(); ?>
<br />
Скорость после подключения услуги <strong>"<?php echo $descr; ?>"</strong>: <strong><?php echo $speed; ?></strong><br />
<?php (Yii::app()->controller->module->showCurrentTurbo) ? $this->renderPartial('_currentTurbo') : ''; ?>