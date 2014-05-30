<h1><?php echo $title; ?></h1>
<div class="form statistics_filter">
    <?php $form = $this->beginWidget('CActiveForm'); ?>
    <div class="form-line">
        <strong><?php echo Yii::t('statistics', 'Period'); ?>:</strong>
        <?php echo $dtfrom; ?>
        &nbsp;&mdash;&nbsp;
        <?php echo $dtto; ?>
        <?php echo CHtml::hiddenField('vgid', $model->vgid); ?>
        <?php echo CHtml::hiddenField('login', $model->login); ?>
        &nbsp;&nbsp;<?php echo CHtml::submitButton(Yii::t('statistics',"Show")); ?>
    </div>
	<?php foreach ($group_filter as $row) { ?>
	<div class="form-line">
		<?php if ($row['label']) { ?><strong><?php echo $row['label']; ?>:</strong><?php } ?>
		<?php foreach($row['items'] as $filter) { ?>
			<?php if ($filter['label']) { ?><strong><?php echo $filter['label']; ?>:</strong><?php } ?>
			<?php echo $filter['html']; ?>&nbsp;&nbsp;
		<?php } ?> 
	</div>
	<?php } ?>
    <?php $this->endWidget(); ?>
</div>
<?php if($total) { ?>
<h3><?php echo yii::t("statistics", "Total"); ?></h3>
<?php foreach ($total as $total_row) { ?>
<div class="form-line"><?php echo $total_row["name"]; ?>: <strong><?php echo $total_row["value"]; ?></strong></div>
<?php } ?>
<br/>
<?php } ?>
<h4><?php echo Yii::t('statistics','StatisticDetailsForVGroup',array('{vglogin}' => $model->login)); ?><?php 
    $params = array(
	'statistics/details',
        'type' => $type,
        'download' => 1
    );
    if(isset($model->vgid) AND $model->vgid) $params["vgid"] = $model->vgid;
    if(isset($model->agrmid) AND $model->agrmid) $params["agrmid"] = $model->agrmid;
    echo CHtml::link(yii::t('statistics','DownloadHistory'), $params, array('class' => 'download_statistics'));
?></h4>
<?php echo $grid; ?>
