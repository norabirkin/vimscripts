<h1><?php echo Yii::t('statistics', 'Statistics'); ?></h1>
<div class="partition">
<?php if ($menu) { foreach ($menu as $k => $v) { ?>
	<h2><a href="<?php echo $this->createUrl('/statistics/'.$v['scope'], array('type' => $k));?>"><?php echo yii::t('statistics',$v['class']); ?></a></h2>
	<p><?php echo yii::t('statistics',$v['class'].'Description'); ?></p>
<?php } } else { echo yii::t('statistics', 'VGroupsNotFound'); } ?>
</div>