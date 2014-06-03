<?php if (!$data) echo yii::t('main', 'Nothing is found in knowledge base'); ?>
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
        <p class="well"><?php echo yii::t('main', 'No data'); ?></p>
        <?php } ?>
        <?php foreach ($item->posts as $post) { ?>
        <div class="well"><?php echo $post->post->text . $post->files; ?></div>
        <?php } ?>
        </div>
    </p>
<?php } ?>
<p>
    <?php echo Yii::t('main', 'You don`t found answer for your question?') ?>
    <a href="<?php echo $this->createUrl('helpdesk/index', array(
        'step' => 2,
        'params' => array(
            2 => array(
                'id' => 0
            )
        )
    ));?>">
        <?php echo Yii::t('main', 'Ask it now.') ?>
    </a>
</p>
