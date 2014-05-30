<?php
$this->breadcrumbs=array(
    Yii::t('Statistics','Статистика') => array('/statistics'),
	Yii::t('Statistics','История платежей'),
);

//$agrmids = array_keys($this->lanbilling->agreements);

//Dumper::dump($model->getAgreementsList()); return;

?>
<h3><?php echo Yii::t('Statistics','История платежей'); ?></h3>
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

<?php echo CHtml::beginForm($this->createUrl('/statistics/StatPayment'),'get',array('id'=>'StatPaymentsForm')); ?>

    <?php
    //$form = $this->beginWidget('CActiveForm', array(
    //    'id' => 'traffstat-form',
    //    'method' => 'get',
    //    'enableAjaxValidation' => true,
    //    'clientOptions' => array(
    //        'validateOnSubmit' => true,
    //        'validateOnChange' => false,
    //        'beforeSend' => 'function(){$(".sepGrid").addClass("loading");}',
    //        'complete' => 'function(){$(".sepGrid").removeClass("loading");}',
    //    ),
    //));
    ?>
    <?php /* echo CHtml::errorSummary($model,'<b>'.Yii::t('Statistics', 'Ошибка!').'</b>','',array('class'=>'alert alert-warning')); */ ?>

    <div class="form-line">

        <strong><?php echo Yii::t('Statistics', 'Период'); ?>:</strong>

        <?php
        // Скриптик для настройки календаря. Меняет дату начала и окончания периода в связке
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

        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
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
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
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
    </div>

    <div class="form-line">
        <?php echo CHtml::activeLabel($model,'agrmid'); ?>
        <?php
            echo CHtml::activeDropDownList(
                $model,
                'agrmid',
                $model->getAgreementsList(),
                array(
                    'empty'=>'-- Все --'
                    //'class' => 'width150'
                )
            );

            //echo $form->dropDownList(
            //    $model,
            //    'agrmid',
            //    $model->getAgreementsList(),
            //    array(
            //        'class' => 'width150',
            //        'ajax' => array(
            //            'type'=>'POST',
            //            'dataType'=>'json',
            //            'url'=>Yii::app()->createAbsoluteUrl('controller/getAgreementsList'),
            //            'success'=>'function(data) {
            //                alert(data);
            //                //if (data.dropdownMetro) {
            //                //    $("#metro-block").show();
            //                //    $("#City_metro_id").html(data.dropdownMetro);
            //                //}
            //                //else {
            //                //    $("#metro-block").hide();
            //                //}
            //            }',
            //        )
            //    )
            //);
        ?>
        <?php /*echo $form->error($model,'agrmid');*/ ?>
    </div>

    <div class="form-line">
        &nbsp;&nbsp;<?php echo CHtml::submitButton(Yii::t('Statistics',"Показать")); ?>
    </div>

<?php CHtml::endForm(); ?>

</div>

<?php
    $columns = array(
        array(
            'name' => Yii::t('Statistics', 'Дата платежа'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["paydate"])',
            'htmlOptions' => array('class'=>'traff'),
        ),
        array(
            'name' => Yii::t('Statistics', 'Договор'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["agrmnum"])',
            'htmlOptions' => array('class'=>'traff'),
        ),
        array(
            'name' => Yii::t('Statistics', 'Номер платежа'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["receipt"])',
            'htmlOptions' => array('class'=>'traff'),
        ),
        array(
            'name' => Yii::t('Statistics', 'Сумма'),
            'type' => 'raw',
            'value'=>array($this,'getPaymentSum'),
            'htmlOptions' => array('class'=>'traff'),
        ),
        array(
            'name' => Yii::t('Statistics', 'Состояние'),
            'type' => 'raw',
            'value'=>array($this,'getPaymentStatus'),
            'htmlOptions' => array('class'=>'traff'),
        ),
        array(
            'name' => Yii::t('Statistics', 'Менеджер'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["mgr"])',
            'htmlOptions' => array('class'=>'traff'),
        ),
        array(
            'name' => Yii::t('Statistics', 'Комментарий'),
            'type' => 'raw',
            'value' => 'CHtml::encode($data["comment"])',
            'htmlOptions' => array('class'=>'traff'),
        ),
    );
    $params = array(
        'data' => $model->getPaymentsHistory(),
        'columns' => $columns,
    );
    echo $this->renderPartial('stat/_table',$params);
?>
