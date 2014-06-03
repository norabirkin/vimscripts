<?php
$this->pageTitle = Yii::app()->name.' - '.Yii::t('TurboModule.Turbo', 'Selecting service');
?>
<?php
    /**
     * If There is no available services for this vgroup
     */
    if ($model->getErrors()) {
?>
    <h3 class="alert alert-warning"><?php echo Yii::t('TurboModule.Turbo', 'There is no available services'); ?></h3>
    <a href="<?php echo $this->createUrl('/account/index');?>"><?php echo Yii::t('TurboModule.Turbo', 'Return to the main page') ?></a>

<?php } else { ?>

<?php echo CHtml::beginForm(); ?>
<?php echo CHtml::errorSummary($model,'<b>'.Yii::t('TurboModule.Turbo', 'Error!').'</b>','',array('class'=>'alert alert-warning')); ?>
    <h3><?php echo Yii::t('TurboModule.Turbo', 'Selecting service'); ?></h3>
    <div>
        <?php echo CHtml::activeLabel($model,'service'); ?>
        <?php
            echo CHtml::activeDropDownList(
                $model,
                'service',
                $services,
                array(
                    'tabindex'=>1,
                    'prompt' => Yii::t('TurboModule.Turbo', 'Select service')
                )
            );
        ?>
    </div>
    <?php echo CHtml::submitButton(Yii::t('TurboModule.Turbo', 'Next'), array('tabindex'=>2)); ?>
<?php CHtml::endForm(); ?>

<?php } ?>

<?php (Yii::app()->controller->module->showCurrentTurbo) ? $this->renderPartial('_currentTurbo') : ''; ?>