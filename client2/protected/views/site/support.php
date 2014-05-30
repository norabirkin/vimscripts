<?php $this->widget('LB.widgets.BootAlert'); ?>

<h2><?php echo Yii::t('app', 'Support') ?></h2>


<?php if (!empty($this->message)) { ?>
<div class="page-message active"><?php echo $this->message ?> <a href="#" onclick="this.parentNode.style.display='none';return false;" class="page-message-close"></a><span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span></div>
<?php } ?>


<?php if(Yii::app()->user->hasFlash('message')):?>
    <div class="page-message active">
        <?php echo Yii::app()->user->getFlash('message');?>	<a class="page-message-close" onclick="this.parentNode.style.display='none';return false;" href="#"></a>
        <span class="cwlg c15">
            <span class="ctl"></span>
            <span class="ctr"></span>
            <span class="cbl"></span>
            <span class="cbr"></span>
        </span>
    </div>
<?php endif;?>

<!-- form>
<div class="form-line">
	<input type="text" class="input-text" value=""> <input type="submit" class="input-submit" value="">
</div>
</form -->

<?
var_dump($this->lanbilling->Posts);return;
?>

<?php $is_first=true ?>
<?php if (count($this->lanbilling->Posts) && !empty($this->lanbilling->Posts[0])) { ?>
	<?php foreach ($this->lanbilling->Posts as $post) { ?>
		<?php if ($post->parent != 0) { ?>
<div class="support-thread"><a class="pseudo support-toggle" href="#post<?php echo $post->id ?>" name="post<?php echo $post->id ?>"><?php echo htmlspecialchars($post->title) ?></a>
	<span class="support-thread-date"><?php echo date("d.m.Y", strtotime($post->date)) ?></span>
	<div class="support-thread-content">
			<?php foreach ($this->lanbilling->PostCategories as $cat) { ?>
				<?php if ($cat->category == $post->category) { ?>
		<div class="support-thread-meta"><?php echo htmlspecialchars($cat->title) ?></div>
				<?php } ?>
			<?php } ?>
		<div class="support-thread-messages">
				<?php foreach ($this->lanbilling->Posts as $pp) { ?>
					<?php if ($pp->parent == $post->id) { ?>
			<div class="support-thread-message">
				<div class="support-thread-message-text"><p><?php echo htmlspecialchars($pp->title); ?></p></div>
				<div class="support-thread-message-date"><?php echo date("d.m.Y H:i", strtotime($pp->date)) ?></div>
			</div>
					<?php } ?>
				<?php } ?>
		</div>

		<div class="support-thread-add-message">
			<form action="<?php echo $this->createUrl('site/support');?>">
				<div class="form-line"><input name="parent" value="<?php echo $post->ticket_id ?>" type="hidden"><input type="hidden" name="category" value="0"><input type="hidden" name="subject" value="Re: <?php echo htmlspecialchars($post->title) ?>"><label class="form-label" for="body<?php echo $post->id ?>"><?php echo Yii::t('app', 'MessageReply2') ?>:</label> <textarea class="input-textarea" name="body" id="body<?php echo $post->id ?>"></textarea></div>
				<!-- div class="form-line"><label class="form-label" for="file"><?php echo Yii::t('app', 'MessageAttach') ?>:</label> <input type="file" id="file" name="file" class="input-file"></div -->
				<div class="form-line"><input type="submit" class="input-submit" value="<?php echo Yii::t('app', 'MessageReply') ?>" name="submit"></div>
			</form>
		</div>
	</div>
</div>
<?php if ($is_first) { $is_first = false ?>
<h2><a class="pseudo support-old-messages" href="#"><?php echo Yii::t('app', 'MessageShowOlder') ?></a></h2>
<div class="support-old-messages-wrap">
<?php } ?>
		<?php } ?>

	<?php } ?>
</div>
<?php } ?>

<!-- p><a href="#" class="pseudo">« Предыдущие 10</a>&nbsp;&nbsp;&nbsp;<a href="#" class="pseudo">Следующие 10 »</a></p -->

<form action="<?php echo $this->createUrl('site/support');?>" method="post" enctype="multipart/form-data" id="new">
<h2><a class="pseudo support-new-message" href="#new"><?php echo Yii::t('app', 'MessageNew') ?></a></h2>
<div class="support-new-message-form" style="display:block">
<?php if (count($this->lanbilling->PostCategories) && !empty($this->lanbilling->PostCategories)) { ?>
	<div class="form-line ">
		<label class="form-label"><?php echo Yii::t('app', 'MessageCategory') ?>:</label>
		<select class="input-select" name="category">
<?php foreach ($this->lanbilling->PostCategories as $cat) { ?>
	<?php if (is_object($cat) && $cat->enabled) { ?>
			<option value="<?php echo $cat->category ?>"><?php echo $cat->title ?></option>
	<?php } ?>
<?php } ?>
		</select>
	</div>
<?php } ?>
	<div class="form-line">
		<label class="form-label"><?php echo Yii::t('app', 'MessageAccount') ?>:</label>
		<select class="input-select" name="agreement">
			<option value="0" selected><?php echo Yii::t('app', 'MessageAny') ?></option>
<?php foreach ($this->lanbilling->agreements as $id => $agreement) { ?>
			<option value="<?php echo $id ?>"><?php echo $agreement->number ?></option>
<?php } ?>
		</select>
	</div>

	<div class="form-line"><label class="form-label"><?php echo Yii::t('app', 'MessageSubject') ?>:</label> <input type="text" class="input-text" value="" name="subject">	</div>
	<div class="form-line"><label class="form-label"><?php echo Yii::t('app', 'MessageBody') ?>:</label> <textarea class="input-textarea" name="body"></textarea></div>
	<!-- div class="form-line"><label class="form-label" for="file"><?php echo Yii::t('app', 'MessageAttach') ?>:</label> <input type="file" id="file" name="file" class="input-file"></div -->
	<div class="form-line"><input type="submit" class="input-submit" value="<?php echo Yii::t('app', 'MessageSend') ?>" name="submit"></div>
</div>
</form>
<script type="text/javascript">if(document.location.hash.replace(/\x2523/g,'#')=='#new'){$('.support-new-message-form').toggleClass('active')}</script>
