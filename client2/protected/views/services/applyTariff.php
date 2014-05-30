<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Изменение тарифного плана');
    $this->breadcrumbs = array(
        Yii::t('Services', 'Тарифы и услуги') => array('/services'),
        Yii::t('Services', 'Тариф: Выбор Учетной Записи') => array('/services/tariff'),
        Yii::t('Services', 'Подтверждение смены тарифного плана')
    );

    $this->widget('LB.widgets.BootAlert');

?>

<div class="main-content">

<h1><?php echo Yii::t('Services', 'Подтверждение смены тарифного плана.'); ?></h1>

<span class="image steps step-4-of-4" title="Шаг 4 из 4"></span>

<h2 class="steps">
	Шаг 4.&nbsp;Подтверждение смены тарифного плана.
</h2>

<?php echo $apply_form; ?>

<?php
    // Таблица с расписанием смены ТП
    $this->renderPartial('_scheduling',array('model'=>$model,'vgid'=>$model->vgid));
?>


</div>