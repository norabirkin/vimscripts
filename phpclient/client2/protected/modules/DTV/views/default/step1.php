<?php $form = $this->beginWidget('CActiveForm'); ?>
<div class="form-line relative">
<div class="phone_dtv_hint">например, 4951234567</div>
<?php echo CHtml::textField('phone','',array('class'=>'phone_masked')); ?>
<?php echo '&nbsp;&nbsp;'.CHtml::submitButton(Yii::t('Statistics',"Проверить")); ?>
</div>
<?php $this->endWidget(); ?>