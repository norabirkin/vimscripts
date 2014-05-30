<h4><?php echo $step->title(); ?></h4>
<h6 style="color: <?php echo (!empty($ticket->ticket->classcolor) && $ticket->ticket->classcolor !== 'FFFFFF') ? '#'.$ticket->ticket->classcolor : '#000'; ?> " >
    <?php echo $ticket->ticket->classname; ?>
</h6>
<?php if ($ticket->posts) { ?>
    <?php foreach ($ticket->posts as $post) { ?>
        <blockquote class="<?php echo ($post->post->authortype) ? 'pull-left' : 'well';?>">
            <p><?php echo $post->post->text;?></p>
            <small><?php echo $post->post->authorname;?> (<?php echo $post->post->createdon;?>)</small>
            <?php echo $post->files; ?>
        </blockquote>
    <?php } ?>
<?php } else { ?>
        <div class="well"><?php echo yii::t('main', 'Nothing found');?></div>
<?php } ?>
<div class="form well">
    <h4><?php echo yii::t('main', 'Add post');?></h4>
    <?php echo $form; ?>
</div>
