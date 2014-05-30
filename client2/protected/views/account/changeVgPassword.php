<?php
$this->pageTitle=Yii::app()->name . ' - '.Yii::t('Account',"Изменение пароля учетной записи {vglogin}", array('{vglogin}' => $model->vglogin));
$this->breadcrumbs=array(
    Yii::t('Account',"Изменение пароля учетной записи {vglogin}", array('{vglogin}' => $model->vglogin)),
);
?>

<h2><?php echo Yii::t('Account',"Изменение пароля учетной записи <b>{vglogin}</b>", array('{vglogin}' => $model->vglogin)); ?></h2>
<?php /*echo $this->renderPartial('menu');*/ ?>

<div class="form">
    <?php $form = $this->beginWidget('CActiveForm', array(
        'id' => 'changepass-form',
        'enableAjaxValidation' => true,
        'clientOptions' => array(
            'validateOnSubmit' => true,
            'validateOnChange' => false,

            'beforeSend' => 'function(){$("#changepass-form").addClass("loading");}',
            'complete' => 'function(){$("#changepass-form").removeClass("loading");}',

        ),
    )); ?>
    <?php /*echo CHtml::errorSummary($model);*/ ?>
    <p class="note"><?php echo Yii::t('Account','Все поля обязательны к заполнению.'); ?></p>
    <table style="width:auto;">
    	
    <tr class="row">
        <td><?php echo $form->label($model,'oldPassword'); ?></td>
        <td><?php echo $form->passwordField($model,'oldPassword'); ?></td>
        <td><?php echo $form->error($model,'oldPassword'); ?></td>
    </tr>
    <tr class="row">
        <td><?php echo $form->label($model,'password'); ?></td>
        <td><?php echo $form->passwordField($model,'password'); ?></td>
        <td><?php echo $form->error($model,'password'); ?></td>
    </tr>

    <tr class="row">
        <td><?php echo $form->label($model,'verifyPassword'); ?></td>
        <td><?php echo $form->passwordField($model,'verifyPassword'); ?></td>
        <td><?php echo $form->error($model,'verifyPassword'); ?></td>
    </tr>

    <tr class="row submit">
        <td><?php echo CHtml::submitButton(Yii::t('Account',"Сохранить")); ?>&nbsp;&nbsp;</td>
        <td><?php echo CHtml::link(Yii::t('Account', 'Вернуться на главную'), array('/account/index')); ?></td>
    	<td></td>
    </tr>
    </table>
<?php $this->endWidget(); ?>
</div><!-- form -->
