<div class="content-aside">
	<p>
		<strong><?php echo $clientName; ?></strong>
	</p>
	<p>
		<?php echo Yii::t('main', 'Greeting') ?>: 
		<br />
		<strong><?php echo $login; ?></strong>
	</p>
<?php if ($userbalance) { ?>
	<p>
		<?php echo Yii::t('app', 'VirtualBalance') ?>: 
		<br />
		<a href="<?php echo $paymentUrl; ?>" class="header-money">
			<?php echo $userbalance; ?>
		</a>
	</p>
<?php } ?>
	<?php echo $newmessages; ?>
	<?php echo $unpaidorders; ?>
	<ul class="custom-list">
        <?php foreach ($this->editors() as $editor) { ?>
        <li>
    		<?php echo yii::t('main', $editor['title']); ?>:
    		<br/>
            <strong>
            	<span id="editable-value-<?php echo $editor['property']; ?>"><?php echo $this->getPropertyValue($editor['property']); ?></span>
            	<?php echo $this->getEditor($editor['property']); ?>
            </strong>
    	</li>
        <?php } ?>
        <div style="height: 10px;"></div>
    </ul>
	<span class="cwlg c15">
		<span class="ctl"></span>
		<span class="ctr"></span>
		<span class="cbl"></span>
		<span class="cbr"></span>
	</span>
</div>
<ul id="client-info">
<?php foreach ($infoblock->data() as $info) { ?>
<li style="padding-bottom: 10px;">
<?php if ($info['time']) { ?>
    <span style="color:#000;">
        <?php echo $info['time']; ?>
    </span>
<?php } ?>
    <?php echo $info['descr']; ?>
</li>
<?php } ?>
</ul>
