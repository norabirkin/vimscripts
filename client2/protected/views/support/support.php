<h2><?php echo Yii::t('support', 'Support') ?></h2>
<?php
    $this->widget('LB.widgets.BootAlert');
    
    if(yii::app()->params['menu_knowledges']) echo CHtml::link(Yii::t('support', 'knowledgeBase'),array('site/kb'));
    echo '<br />';
    echo CHtml::link(Yii::t('support', 'AddTicket'),array('support/add'), array('class'=>'add-class'));

    //Dumper::dump($ticketsList);

    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'tickets-grid',
        'dataProvider' => $ticketsList,
        'itemsCssClass'=>'table table-striped table-bordered table-condensed ',
        'pagerCssClass'=>'pagination',
        'enablePagination' => true,
        'template'=>'{summary} {pager} {items} {pager}',
        'pagerCssClass'=>'pager',
        'pager' => array( 'cssFile' => false,),
        'columns' => array(
            array(
                'name' => Yii::t('support', 'ID'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["id"])'
            ),
            array(
                'name' => Yii::t('support', 'Title'),
                'type' => 'raw',
                'value' => 'CHtml::link(CHtml::encode($data["name"]), array("support/showTicket","id"=>$data["id"]))',
            ),
            array(
                'name' => Yii::t('support', 'Last'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["respondentname"])',
            ),
            array(
                'name' => Yii::t('support', 'ResponseTime'),
                'type' => 'raw',
                'value' => 'CHtml::encode(Yii::app()->dateFormatter->format("dd.MM.yyyy, HH:mm:ss", $data["lastpost"]))',
            ),
            array(
                'class'=>'DataColumn',
                'evaluateHtmlOptions'=>true,
                'name' => Yii::t('support', 'State'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["status"]["descr"])',
                'htmlOptions'=>array('style'=>'"color:#{$data[\'status\'][\'color\']};"'),
                //'htmlOptions'=>array('style'=>'text-align:right; color:#'.$ticketsList),

            ),
        ),
    ));
