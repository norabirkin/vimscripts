<?php $form = $this->beginWidget('CActiveForm'); ?>
<div class="form statistics_filter">
<?php $i = 0; foreach ($data as $row) { ?>
<div class="form-line"><?php echo $row->output(); ?> <?php if (!$i) echo '&nbsp;&nbsp;'.CHtml::submitButton(Yii::t('Statistics',"Показать")); ?></div>
<?php $i ++; } ?>
</div>
<?php foreach ($store as $param) echo CHtml::hiddenField($param,yii::app()->request->getParam($param,0)); ?>
<?php $this->endWidget(); ?>