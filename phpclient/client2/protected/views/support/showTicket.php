<?php $this->widget('LB.widgets.BootAlert'); ?>

<?php /*Dumper::dump($statuses);*/ ?>

<h2><?php echo Yii::t('support', 'Subject');?>: <?php echo $ticket->ticket->name;?></h2>

<?php /*Dumper::dump($ticket);*/ ?>

<?php if (!empty($ticket->ticket->classname)) {  ?>
    <h6 style="color: <?php echo (!empty($ticket->ticket->classcolor) && $ticket->ticket->classcolor !== 'FFFFFF') ? '#'.$ticket->ticket->classcolor : '#000'; ?> ">
        <?php echo $ticket->ticket->classname; ?>
    </h6>
<?php } ?>

<?php /* if (!empty($ticket['ticket']['respondentname'])) :  ?>
    <h3>
        <?php echo Yii::t('support', 'Respondent name');?>: <?php echo $ticket['ticket']['respondentname']; ?>
    </h3>
<?php endif; */?>


<?php
if ($ticket->posts) {
    foreach ($ticket->posts as $post) { ?>
        <blockquote class="<?php echo ($post->post->authortype) ? 'pull-left' : 'well';?>">
        <p><?php echo $post->post->text;?></p>
        <small><?php echo $post->post->authorname;?> (<?php echo $post->post->createdon;?>)</small>
        <?php echo $post->files; ?>
        </blockquote>
    <?php }
} else { ?>
    <div class="well"><?php echo Yii::t('support', 'NoTickets');?></div>
<?php }



if ($statuses[$ticket->ticket->statusid]['clientmodifyallow'] == 1){
?>
<div class="form well">
<h4><?php echo Yii::t('support', 'AddTicket');?></h4>
<?php echo CHtml::beginForm('', 'post', array('enctype' => 'multipart/form-data')); ?>
    <?php echo CHtml::errorSummary($model,'<b>'.Yii::t('support', 'DataSavingError').'</b>','',array('class'=>'alert alert-error')); ?>
    <div>
        <?php echo CHtml::activeLabel($model,'sbss_status'); ?>
        <div>
            <?php echo CHtml::activeDropDownList($model, 'sbss_status', CHtml::listData($model->getStatuses(true), 'id', 'descr'), array('empty' => Yii::t('support', 'Default')) ); ?>
        </div>
    </div>
    <div>
        <div><?php echo yii::t('support', 'Attach file'); ?></div>
        <div style="background: #E9E9E9; padding: 20px; margin-bottom: 9px; width: 356px;">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <?php echo CHtml::activeLabel($model,'sbss_file_descr', array('style' => 'color: #666;')); ?>:&nbsp;
                        </td>
                        <td>
                            <?php echo CHtml::activeTextField($model,'sbss_file_descr', array('class' => 'input-text')); ?>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <?php echo CHtml::activeLabel($model,'sbss_file', array('style' => 'color: #666;')); ?>:&nbsp;
                        </td>
                        <td>
                            <?php echo CHtml::activeFileField($model,'sbss_file'); ?>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div>
        <?php echo CHtml::activeLabel($model,'sbss_text'); ?>
        <div>
            <?php echo CHtml::activeTextArea($model,'sbss_text'); ?>
        </div>
    </div>

    <div style="padding-top: 10px;">
        <?php echo CHtml::submitButton(Yii::t('support', 'Answer')); ?>
    </div>
<?php echo CHtml::endForm(); ?>
</div><!-- form well -->
<?php
}
