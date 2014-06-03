<?php
$Turbo = new Turbo();
echo '<h2>'.Yii::t('TurboModule.Turbo', 'Current turbo services').'</h2>';
$this->widget('zii.widgets.grid.CGridView', array(
    'id' => 'turbo-grid',
    'dataProvider' => $Turbo->getCurrentTurbo(),
    'itemsCssClass'=>'table table-striped table-bordered table-condensed ',
    'enablePagination' => false,
    'template'=>'{items}',
    'columns' => array(
        array(
            'name' => Yii::t('TurboModule.Turbo', 'Start date'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["timefrom"])'
        ),
        array(
            'name' => Yii::t('TurboModule.Turbo', 'End date'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["timeto"])'
        ),
        array(
            'name' => Yii::t('TurboModule.Turbo', 'Login'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["login"])',
        ),
        array(
            'name' => Yii::t('TurboModule.Turbo', 'Shape'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["shape"])',
        ),
        array(
            'name' => Yii::t('TurboModule.Turbo', 'Description'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["descr"])',
        )
    ),
));