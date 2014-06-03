<?php
$this->breadcrumbs=array(
    Yii::t('Statistics','Статистика') => array('/statistics'),
	Yii::t('Statistics','Статистика по трафику') => array('/statistics/StatTraff'),
    Yii::t('Statistics','Детальная статистика для {vglogin}',array('{vglogin}' => Yii::app()->request->getParam('login', '')))
);
?>
<h3><?php echo Yii::t('Statistics','Детальная статистика по трафику для {vglogin}',array('{vglogin}' => Yii::app()->request->getParam('login', ''))); ?></h3>
<style>
table {
	border-spacing: 3px!important;
	border-collapse: separate!important;
}
.sepGrid td.traff{
    text-align: right;
}
</style>

<div class="form">
    <?php $form = $this->beginWidget('CActiveForm', array(
        'id' => 'traffstat-form',
        'enableAjaxValidation' => true,
        'clientOptions' => array(
            'validateOnSubmit' => true,
            'validateOnChange' => false,
            'beforeSend' => 'function(){$(".sepGrid").addClass("loading");}',
            'complete' => 'function(){$(".sepGrid").removeClass("loading");}',
        ),
    )); ?>
    <?php /* echo CHtml::errorSummary($model,'<b>'.Yii::t('Statistics', 'Ошибка!').'</b>','',array('class'=>'alert alert-warning')); */ ?>

    <div class="form-line">

        <strong><?php echo Yii::t('Statistics', 'Период'); ?>:</strong>

        <?php
        // Скриптик для настройки календаря. Меняет даку начала и окончания периода в связке
        Yii::app()->clientScript->registerScript('daterangescript',"
            var dates = $('#dtfrom, #dtto').datepicker({
                defaultDate: 'null',
                showAnim: 'fold',
                changeMonth: true,
                changeYear: false,
                showOtherMonths: true,
                hideIfNoPrevNext: true,
                dateFormat: 'yy-mm-dd',
                showButtonPanel: 'true',
                onSelect: function( selectedDate ) {
                    var option = this.id == 'dtfrom' ? 'minDate' : 'maxDate',
                        instance = $( this ).data( 'datepicker' );
                        date = $.datepicker.parseDate(
                            instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings
                        );
                    dates.not( this ).datepicker( 'option', option, date );
                }
            });
            $('#dtfrom').datepicker('option', 'maxDate', '".$date['dtto']."');
            $('#dtto').datepicker('option', 'minDate', '".$date['dtfrom']."');
            ",
            CClientScript::POS_READY
        );

        $form->widget('zii.widgets.jui.CJuiDatePicker', array(
            'model'=>$model,
            'name'=>'dtfrom',
            'id'=>'dtfrom',
            'value'=> ($date['dtfrom']) ? $date['dtfrom'] : '',
            'htmlOptions'=>array(
                'style'=>'height:20px;width:90px;',
                'class'=>'input-text',
                'readonly'=>true,
            ),
        ));
        echo '&nbsp;&mdash;&nbsp;';
        $form->widget('zii.widgets.jui.CJuiDatePicker', array(
            'model'=>$model,
            'name'=>'dtto',
            'id'=>'dtto',
            'value'=> ($date['dtto']) ? $date['dtto'] : '',
            'htmlOptions'=>array(
                'style'=>'height:20px;width:90px;',
                'class'=>'input-text',
                'readonly'=>true
            ),
        ));
        ?>
        <?php echo CHtml::hiddenField('vgid', $model->vgid); ?>
        <?php echo CHtml::hiddenField('login', $model->login); ?>
        &nbsp;&nbsp;<?php echo CHtml::submitButton(Yii::t('Statistics',"Показать")); ?>
    </div>

    <div class="form-line">
        <strong><?php echo Yii::t('Statistics', 'Группировать по'); ?>:</strong>
        <?php
            echo $form->radioButtonList(
                $model,
                'group',
                $groupList,
                array('separator'=>'')
            );
        ?>
    </div>

<?php $this->endWidget(); ?>

</div>


<?php
    echo '<div class="gridium">';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'traffstat-grid',
        'dataProvider' => $model->getTraffStat(),
        //'ajaxUpdate'=>true,
        'itemsCssClass'=>'sepGrid',
        'enablePagination' => true,
        'template'=>'{summary} {pager} <br/> {items} <br/> {pager}',
        'emptyText' => Yii::t('Statistics', 'Нет данных за выбранный период.'),
        'columns' => $columns,
    ));
    echo '</div>';
