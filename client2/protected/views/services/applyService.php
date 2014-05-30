<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Изменение тарифного плана');
    $this->breadcrumbs = array(
        Yii::t('Services', 'Тарифы и услуги') => array('/services'),
        Yii::t('Services', 'Тариф: Выбор услуги') => array('/services/services'),
        Yii::t('Services', 'Подтверждение подключения услуги')
    );

    $this->widget('LB.widgets.BootAlert');

?>

<div class="main-content">

<h1><?php echo Yii::t('Services', 'Подтверждение подключения услуги.'); ?></h1>

<span class="image steps step-4-of-4" title="Шаг 4 из 4"></span>

<h2 class="steps">
	Шаг 4.&nbsp;Подтверждение подключения услуги.
</h2>
<br/>
<?php $form=$this->beginWidget('CActiveForm'); ?>
<?php echo CHtml::errorSummary($model,'<b>'.Yii::t('Services', 'Внимание! При проверке возникли ошибки:').'</b>','',array('class'=>'alert alert-error')); ?>

<div class="form-line">
    <?php echo Yii::t('Services','Выбранная услуга: <strong>{service}</strong>',array('{service}'=>$model->catdescr)); ?>
</div>
<div class="form-line">
    <?php if ($model->common) echo Yii::t('Services','Дата начала действия услуги: <strong>{date}</strong>',array('{date}'=>$model->dtfrom)); 
          else echo Yii::t('Services','Дата заказа услуги: <strong>{date}</strong>',array('{date}'=>$model->dtfrom));
    ?>
</div>
<?php if ($model->common) { ?>
<div class="form-line">
    <?php echo Yii::t('Services','Дата окончания действия услуги: <strong>{date}</strong>',array('{date}'=>($model->dtto)?$model->dtto:'не ограничена')); ?>
</div>
<?php } ?>
<div class="form-line">
    <?php /*echo $form->hiddenField('tarid', $model->tarid);*/ ?>
    <?php echo $form->hiddenField($model,'catidx',array('value'=>$model->catidx)); ?>
    <?php /*echo $form->hiddenField('changeDate', $model->changeDate);*/ ?>
    <?php echo $form->hiddenField($model,'servid',array('value'=>$model->servid)); ?>
    <?php echo $form->hiddenField($model,'dtfrom',array('value'=>$model->dtfrom)); ?>
    <?php echo $form->hiddenField($model,'dtto',array('value'=>$model->dtto)); ?>
    <?php echo CHtml::submitButton(Yii::t('Services', 'Согласен')); ?>&nbsp;&nbsp;&nbsp;
    <?php echo CHtml::link(Yii::t('Services', 'Вернуться в начало'), array('/services/services')); ?>
</div>

<?php $this->endWidget(); ?>

<?php
    // Таблица с расписанием смены ТП
    //$this->renderPartial('_scheduling',array('model'=>$model,'vgid'=>$model->vgid));
?>


</div>