<?php
$this->pageTitle = Yii::app()->name.' - '.Yii::t('TurboModule.Turbo', 'Common info');
$this->widget('LB.widgets.BootAlert');
?>
<?php echo CHtml::beginForm(); ?>
    <?php echo CHtml::errorSummary($model,'<b>'.Yii::t('TurboModule.Turbo', 'Error!').'</b>','',array('class'=>'alert alert-warning')); ?>

    <h3><?php echo Yii::t('TurboModule.Turbo', 'You have select the following service parameters:');?></h3>

    <?php
        $this->widget('zii.widgets.CDetailView', array(
            'data' => $cost,
            'attributes'=>array(
                array(
                    'name'  => Yii::t('TurboModule.Turbo', 'Agreement number'),
                    'type'  => 'raw',
                    'value' => CHtml::encode($cost['agrmNumber']),
                ),
                array(
                    'name'=> Yii::t('TurboModule.Turbo', 'Agreement balance'),
                    'value'=> Yii::app()->NumberFormatter->formatCurrency($cost['balance'], 'RUB'),
                ),
                array(
                    'name'=> Yii::t('TurboModule.Turbo', 'Available balance'),
                    'value'=> Yii::t(
                        'TurboModule.Turbo',
                        '{totalBalance} (Agreement balance: {balance}; credit: {credit})',
                        array(
                            '{totalBalance}' => Yii::app()->NumberFormatter->formatCurrency($cost['totalBalance'], 'RUB'),
                            '{balance}'      => Yii::app()->NumberFormatter->formatCurrency($cost['balance'], 'RUB'),
                            '{credit}'       => Yii::app()->NumberFormatter->formatCurrency($cost['credit'], 'RUB'),
                        )
                    )
                ),
                array(
                    'name'  => Yii::t('TurboModule.Turbo', 'Service'),
                    'type'  => 'raw',
                    'value' => CHtml::encode($cost['serviceDescr']),
                ),
                array(
                    'name'=> Yii::t('TurboModule.Turbo', 'Cost'),
                    'value'=> Yii::app()->NumberFormatter->formatCurrency($cost['serviceCost'], 'RUB'),
                ),
                array(
                    'name'=> Yii::t('TurboModule.Turbo', 'Duration'),
                    'value'=> Yii::t('TurboModule.Turbo', '{n} hour|{n} hours', $cost['duration']),
                ),
                array(
                    'name'=> Yii::t('TurboModule.Turbo', 'Shape'),
                    'value'=> $cost['speed'],
                ),
                array(
                    'name'=> Yii::t('TurboModule.Turbo', 'Total cost'),
                    'value'=> Yii::app()->NumberFormatter->formatCurrency($cost['totalCost'], 'RUB'),
                    'html'
                ),

            ),
        ));
    ?>
    <div style="padding-top: 10px;text-align: center;">
        <?php
            if ($cost['totalCost'] <= $cost['totalBalance']){
                echo CHtml::activeHiddenField($model,'save');
                echo CHtml::submitButton(Yii::t('TurboModule.Turbo', 'Pay'));
            }
            else
                echo CHtml::link(Yii::t('TurboModule.Turbo', 'Return to the previous page'), array('turbo/Step3'));
        ?>
    </div>
<?php echo CHtml::endForm(); ?>

<?php (Yii::app()->controller->module->showCurrentTurbo) ? $this->renderPartial('_currentTurbo') : ''; ?>