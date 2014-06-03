<?php
$this->pageTitle = Yii::app()->name.' - '.Yii::t('TurboModule.Turbo', 'Selecting vgroup');
?>
<?php
    /**
     * If There is no available services for this vgroup
     */
    if ($model->getErrors()) {
?>
    <h3 class="alert alert-warning"><?php echo $alert_warning_message; ?></h3>
    <a href="<?php echo $this->createUrl('/account/index');?>"><?php echo Yii::t('TurboModule.Turbo', 'Return to the main page') ?></a>

<?php } else { ?>

<?php echo CHtml::beginForm(); ?>
<?php echo CHtml::errorSummary($model,'<b>'.Yii::t('TurboModule.Turbo', 'Error!').'</b>',null,array('class'=>'alert alert-warning')); ?>
    <h3><?php echo Yii::t('TurboModule.Turbo', 'Selecting vgroup'); ?></h3>
    <div>
        <?php echo CHtml::activeLabel($model,'vgroup'); ?>
        <?php
            echo CHtml::activeDropDownList(
                $model,
                'vgroup',
                $avlVgroups,
                array(
                    'tabindex'=>1,
                    'prompt' => Yii::t('TurboModule.Turbo', 'Select account')
                )
            );
        ?>
    </div>
    <?php echo CHtml::submitButton(Yii::t('TurboModule.Turbo', 'Next'), array('tabindex'=>2)); ?>
<?php CHtml::endForm(); ?>

<?php } ?>

<?php (Yii::app()->controller->module->showCurrentTurbo) ? $this->renderPartial('_currentTurbo') : ''; ?>