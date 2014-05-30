<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Изменение тарифного плана');
    $this->breadcrumbs = array(
        Yii::t('Services', 'Тарифы и услуги') => array('/services'),
        Yii::t('Services', 'Выбор даты подключения услуги'),
    );

    $this->widget('LB.widgets.BootAlert');

?>

<div class="main-content">

<h1><?php echo Yii::t('Services', 'Выбор даты подключения услуги.'); ?></h1>

<span class="image steps step-3-of-4" title="Шаг 3 из 4"></span>

<h2 class="steps">
	Шаг 3.&nbsp;Выбор даты подключения услуги.
</h2>
<br/>

<?php echo $html; ?>

<?php /*echo Yii::t('Services','Выбранная услуга: <strong>{service}</strong>',array('{service}'=>$model->catdescr)); ?>

<?php echo CHtml::beginForm(); ?>
<?php echo CHtml::errorSummary($model,'<b>'.Yii::t('Services', 'Внимание! При проверке возникли ошибки:').'</b>','',array('class'=>'alert alert-error')); ?>

<table cellpadding="0" cellspacing="0" class="table_date_form">
    <tr>
        <td><strong><?php if ($common) echo Yii::t('services', 'Дата начала действия услуги'); else echo Yii::t('services', 'Дата заказа услуги'); ?></strong></td>
        <td><?php echo $dtfrom; ?></td>
    </tr> 
<?php if ($common) { ?>
    <tr>
       
        <td><strong><?php echo Yii::t('services', 'Дата окончания действия услуги'); ?></strong></td>
        <td><?php echo $dtto; ?>&nbsp;<span class="hint">(гггг-мм-дд).</span></td>
    </tr>
<?php } ?>
</table>

<?php if(!$common) { ?>
<input type="hidden" name="Services[dtto]" value="" />
<?php } ?>
<br/>
<input type="hidden" name="servid" value="<?php echo $servid; ?>" />
<?php echo CHtml::submitButton(Yii::t('Services', 'Сохранить')); ?>&nbsp;
<?php echo CHtml::link(Yii::t('Services', 'Вернуться в начало'), array('/services/services')); ?>
<?php CHtml::endForm(); */ ?>
</div>