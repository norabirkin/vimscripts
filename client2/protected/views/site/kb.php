<h1><?php echo $title; ?></h1>
<?php $this->widget('LB.widgets.BootAlert'); ?>

<?php if (!$data) echo yii::t('knowledgebase', 'KBNothing'); ?>
<?php foreach ($data as $item) { ?>
    <a
        href="#"  
        class="pseudo"
        onclick="$(this).next().next().toggle();return false;"
    >
        <h4>
            <?php echo $item->name ?>
            <small>
               <?php echo $item->classname; ?>
               <?php if ($item->authorname) { ?>
               <strong><?php echo $item->authorname; ?></strong>
               <?php } ?>
            </small>
        </h4>
    </a>
    <p>
        <div class="faq-answer" style="display:none">
        <?php if (!$item->posts) { ?>
        <p class="well"><?php echo yii::t('knowledgebase', 'ThereIsNoData'); ?></p>
        <?php } ?>
        <?php foreach ($item->posts as $post) { ?>
        <div class="well"><?php echo $post->post->text . $post->files; ?></div>
        <?php } ?>
        </div>
    </p>
<?php } ?>
<p>
    <?php echo Yii::t('knowledgebase', 'NotFoundAnswer1') ?>
    <a href="<?php echo $this->createUrl('support/add');?>">
        <?php echo Yii::t('knowledgebase', 'NotFoundAnswer2') ?>
    </a>
</p>
