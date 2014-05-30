<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Изменение тарифного плана');
    $this->breadcrumbs = array(
        Yii::t('Services', 'Тарифы и услуги') => array('/services'),
        Yii::t('Services', 'Тариф: Выбор Учетной Записи') => array('/services/tariff'),
        Yii::t('Services', 'Выбор тарифного плана'),
        Yii::t('Services', 'Выбор даты смены тарифного плана'),
    );

    $this->widget('LB.widgets.BootAlert');

?>

<div class="main-content">

<h1><?php echo Yii::t('Services', 'Выбор даты смены тарифного плана.'); ?></h1>

<?php
    // Таблица с расписанием смены ТП
    echo $schedule; 
//$this->renderPartial('_scheduling',array('model'=>$model,'vgid'=>$model->vgid));
?>

<span class="image steps step-3-of-4" title="Шаг 3 из 4"></span>

<h2 class="steps">
	Шаг 3.&nbsp;Выбор даты смены тарифного плана.
</h2>
<br/>

<?php echo $date_form;  /* echo Yii::t('Services','Выбранный тарифный план: <b>{tariff}</b>',array('{tariff}'=>$model->tarname)); ?>

<?php echo CHtml::beginForm(); ?>
<?php echo CHtml::errorSummary($model,'<b>'.Yii::t('Services', 'Внимание! При проверке возникли ошибки:').'</b>','',array('class'=>'alert alert-error')); ?>
<?php
    // Сообщение о минимальной дате
    echo $introMessage;

    echo '<p>';
    echo '<b>'.Yii::t('Services', 'Дата смены тарифного плана').':</b>&nbsp;';
    
    echo $model->get_date_picker();
    
    echo '&nbsp;<span class="hint">(гггг-мм-дд).</span></p>';


?>
<br/>
<?php echo CHtml::submitButton(Yii::t('Services', 'Сменить')); ?>&nbsp;
<?php echo CHtml::link(Yii::t('Services', 'Вернуться в начало'), array('/services/tariff')); */ ?>
</div>