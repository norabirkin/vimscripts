<?php $this->widget('LB.widgets.BootAlert'); ?>

<h2><?php echo Yii::t('support', 'TicketCreating');?></h2>

<div class="form">
<?php echo CHtml::beginForm(); ?>
    <?php echo CHtml::errorSummary($model,'<b>'.Yii::t('support', 'DataSavingError').'</b>','',array('class'=>'alert alert-error')); ?>

    <div>
        <?php echo CHtml::activeLabel($model,'sbss_class'); ?>
        <div>
            <?php echo CHtml::activeDropDownList($model,'sbss_class', CHtml::listData($model->getClasses(), 'id', 'descr'), array('empty' => Yii::t('support', 'Default')) ); ?>
        </div>
    </div>
    <div>
        <?php echo CHtml::activeLabel($model,'sbss_status'); ?>
        <div>
            <?php echo CHtml::activeDropDownList($model, 'sbss_status', CHtml::listData($model->getStatuses(true), 'id', 'descr'), array('empty' => Yii::t('support', 'Default')) ); ?>
        </div>
    </div>
    <div>
        <?php echo CHtml::activeLabel($model,'sbss_title'); ?>
        <div>
            <?php echo CHtml::activeTextField($model,'sbss_title'); ?>
        </div>
    </div>
    <div>
        <?php echo CHtml::activeLabel($model,'sbss_text'); ?>
        <div>
            <?php echo CHtml::activeTextArea($model,'sbss_text'); ?>
        </div>
    </div>

    <div style="padding-top: 10px;">
        <?php echo CHtml::submitButton(Yii::t('support', 'Create')); ?>
    </div>
<?php echo CHtml::endForm(); ?>
</div><!-- form -->
