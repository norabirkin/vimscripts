<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Изменение тарифного плана');
    $this->breadcrumbs = array(
        Yii::t('Services', 'Тарифы и услуги') => array('/services'),
        Yii::t('Services', 'Тариф: Выбор Учетной Записи') => array('/services/tariff'),
        Yii::t('Services', 'Выбор тарифного плана'),
    );
    $this->widget('LB.widgets.BootAlert');
    //$selectedVG = $model->getVgWithTariffs( true );
?>

<div class="main-content">

<h1>Тариф: Шаг 2. <?php echo Yii::t('Services', 'Выбор тарифного плана'); ?></h1>

<?php
    // Таблица с расписанием смены ТП
    echo $schedule;
    //$this->renderPartial('_scheduling',array('model'=>$model,'vgid'=>$model->vgid));
?>

<span class="image steps step-2-of-4" title="Шаг 2 из 4"></span>

<!--<h2 class="steps">
	Шаг 2.&nbsp;Выбор тарифного плана  для <?php echo $selectedVG->vgroup->login; ?>
</h2>-->
<br/>

<?php echo $grid; ?>

<?php echo CHtml::link(Yii::t('Services', 'Вернуться к выбору учетной записи'), array('/services/tariff')); ?>

</div>