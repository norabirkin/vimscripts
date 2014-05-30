<?php
$this->breadcrumbs=array(
    Yii::t('DTVModule.smartcards','TV channels') => array('/DTV/smartcards'),
	Yii::t('DTVModule.smartcards','PersonalTelevision'),
);
$this->widget('LB.widgets.BootAlert');

    /**
     * If There is no available services for this vgroup
     */
if ($model->getErrors()) {
?>
    <h3 class="alert alert-warning"><?php echo Yii::t('DTVModule.smartcards', 'There is no available services'); ?></h3>
    <a href="<?php echo $this->createUrl('/account/index');?>"><?php echo Yii::t('DTVModule.smartcards', 'Back') ?></a>
<?php } else { ?>

<?php echo CHtml::beginForm(); ?>
<?php echo CHtml::errorSummary($model,'<b>'.Yii::t('DTVModule.smartcards', 'Error!').'</b>','',array('class'=>'alert alert-warning')); ?>
<style>
table {
	border-spacing: 3px!important;
	border-collapse: separate!important;
}
</style>

<h1 class="extra"><?php echo Yii::t('DTVModule.smartcards','Personal TV settings'); ?></h1>
<h4><?php echo yii::t('DTVModule.smartcards','TV channels'); ?></h4>
<div class="lb_table_wrp">
<?php
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'vg-alacarte-grid',
        //'itemsCssClass'=>'sepGrid',
        'dataProvider' => $tvPackages,
        'ajaxUpdate'=>true,
        'cssFile' => Yii::app()->theme->baseUrl. '/css/grid.css',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('DTVModule.equipment', 'There is no available channels'),
        'columns' => array(
            array(
                'name' => Yii::t('DTVModule.equipment', 'Channel name'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["catdescr"])',
                //'htmlOptions' => array('class'=>'first'),
            ),
            array(
                'name' => Yii::t('DTVModule.smartcards', 'State'),
                'type' => 'raw',
                'value' => array($model,'get_personal_tv_chanel_status'),
                //'value' => '( ($data["servid"] > 0 && $data["assigned"] == 1  && strtotime($data["timeto"]) > time()) || ($data["servid"] > 0 && $data["assigned"] == 0  && strtotime($data["timeto"]) > time()) ) ? "<i style=\'color:green;\'>Подключен</i>" : "<i>Не подключен</i>"',
                'htmlOptions' => array('width'=>90),
            ),
            array(
                'name' => Yii::t('DTVModule.smartcards', 'Date'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["timefrom"])',//'( $data["timefrom"] != "" && ($data["servid"] > 0 && $data["assigned"] == 1  && strtotime($data["timeto"]) > time()) || ($data["servid"] > 0 && $data["assigned"] == 0  && strtotime($data["timeto"]) > time()) ) ? CHtml::encode($data["timefrom"]) : "&nbsp;"',
                'htmlOptions' => array('class'=>'date'),
            ),
            array(
                'name' => Yii::t('DTVModule.smartcards', 'Above'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["above"])',
                'htmlOptions' => array('class'=>'currency'),
            ),
            array(
                'name' => Yii::t('DTVModule.smartcards', 'Currency'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["symbol"])',
                'htmlOptions' => array('class'=>'currency'),
            ),
            /*array(
                'class' => 'CCheckBoxColumn',
                'selectableRows' => 2,
                'checkBoxHtmlOptions' => array(
                    'name' => 'catidx[]'
                ),
                'value'=>'$data["catidx"]',
                'checked' => array($model,'get_personal_tv_chanel_assigned'),
            ),*/
            array(
                'type' => 'raw',
                'value'=>array($model,'get_personal_tv_chanel_checkbox')
            ),

        ),
    ));
?>
</div>

    <?php echo CHtml::hiddenField('save', 1);?>
    <?php echo CHtml::hiddenField('totalbalance', $agreement['balance']+$agreement['credit']);?>
    <?php echo CHtml::submitButton(Yii::t('DTVModule.smartcards', 'Apply')); ?>&nbsp;
    <?php echo CHtml::link(Yii::t('DTVModule.smartcards', 'Back'), array('/DTV/smartcards',"item" => Yii::app()->request->getParam("item"))); ?>
    <?php CHtml::endForm(); ?>
<?php } ?>
