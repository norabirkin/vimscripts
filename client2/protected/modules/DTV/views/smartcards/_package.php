<style>
table {
	border-spacing: 3px!important;
	border-collapse: separate!important;
}
</style>
<h2 class="extra"><?php echo Yii::t('DTVModule.smartcards','UpdateChannelsList'); ?></h2>
<?php
$errAdd = false;
$this->pageTitle = Yii::app()->name.' - '.Yii::t('DTVModule.smartcards', 'UpdateChannelsList');

$this->breadcrumbs=array(
    Yii::t('DTVModule.smartcards','Television') => array('/DTV/smartcards'),
	Yii::t('DTVModule.smartcards','PersonalTelevision') => array('/DTV/Smartcards/Lacarte'),
    Yii::t('DTVModule.smartcards','UpdateChannelsList'),
);

echo CHtml::beginForm();

    if (is_array($chanelsList))
    {
        if (isset($chanelsList['add']) === true)
        {
            function pageTotal($data)
            {
                $total=0;
                foreach($data as $item)
                    $total+=$item['above'];
                return $total;
            }

            $totalBalance = pageTotal($chanelsList['add']);

            if ($_POST['totalbalance'] >= $totalBalance){
                foreach ($chanelsList['add'] as $key=>$val){
                    echo CHtml::hiddenField('dat[b_'.$key.'][vgid]',$val['vgid']);
                    echo CHtml::hiddenField('dat[b_'.$key.'][catidx]',$val['catidx']);
                    echo CHtml::hiddenField('dat[b_'.$key.'][servid]',$val['servid']);
                    echo CHtml::hiddenField('dat[b_'.$key.'][action]',1);
                }

            } else $errAdd = true;


            $relatedTVPackagesAdd = new CArrayDataProvider($chanelsList['add'], array(
                'id'       => 'smartPackages',
                'keyField' => 'catidx',
                'sort'     => array(
                    'attributes' => array(
                        'catdescr',
                    ),
                ),
            ));

            if ( (isset($chanelsList['add']) === true) && count($chanelsList['add']) > 0 && $errAdd){
                //if (isset($chanelsList['remove']) === true && count($chanelsList['remove'])>0)
                    echo "<h4 style='color:red;'>".yii::t('DTVModule.smartcards','LowBalance')."</h4>";
            }
            else
            {
                echo '<h2 style="color: green;">'.Yii::t('DTVModule.smartcards', 'ChannelsToAddList').'</h2>';
            }

            echo '<div class="lb_table_wrp">';
            $this->widget('zii.widgets.grid.CGridView', array(
                'id' => 'vg-smartcards-grid',
                'dataProvider' => $relatedTVPackagesAdd,
                'ajaxUpdate'=>true,
                'cssFile' => Yii::app()->theme->baseUrl. '/css/grid.css',
                //'itemsCssClass'=>'table table-striped table-bordered table-condensed ',
                //'itemsCssClass'=>'sepGrid',
                'enablePagination' => false,
                'template'=>'{items}',
                'emptyText' => Yii::t('DTVModule.smartcards', 'There is no available channels'),
                'columns' => array(
                    array(
                        'name' => Yii::t('DTVModule.equipment', 'Channel name'),
                        'type' => 'raw',
                        'value' => 'CHtml::encode($data["catdescr"])',
                        'footer'=>'<strong>'.yii::t('DTVModule.smartcards','Total').':</strong>',
                    ),
                    array(
                        'name' => Yii::t('DTVModule.smartcards', 'Above'),
                        'type' => 'raw',
                        'value' => 'CHtml::encode($data["above"])',
                        'htmlOptions' => array('width'=>100),
                        'footer'=>'<b>'.$totalBalance.'</b>',
                    ),
                    array(
                        'name' => Yii::t('DTVModule.smartcards', 'Currency'),
                        'type' => 'raw',
                        'value' => 'CHtml::encode($data["symbol"])',
                        'htmlOptions' => array('width'=>70),
                    ),

                ),
            ));
            echo '</div>';

        }

        if (isset($chanelsList['remove']) === true) {
            $relatedTVPackagesRemove = new CArrayDataProvider($chanelsList['remove'], array(
                'id'       => 'smartPackages',
                'keyField' => 'catidx',
                'sort'     => array(
                    'attributes' => array(
                        'catdescr',
                    ),
                ),
            ));
            foreach ($chanelsList['remove'] as $key=>$val){
                echo CHtml::hiddenField('dat[a_'.$key.'][vgid]',$val['vgid']);
                echo CHtml::hiddenField('dat[a_'.$key.'][catidx]',$val['catidx']);
                echo CHtml::hiddenField('dat[a_'.$key.'][servid]',$val['servid']);
                echo CHtml::hiddenField('dat[a_'.$key.'][action]',2);
            }
        ?>
        <h2 style="color: red;"><?php echo Yii::t('DTVModule.smartcards', 'ChannelsToUnsubscribeList'); ?></h2>
        <?php
            echo '<div class="gridium">';
            $this->widget('zii.widgets.grid.CGridView', array(
                'id' => 'vg-smartcards-grid',
                'dataProvider' => $relatedTVPackagesRemove,
                'ajaxUpdate'=>true,
                //'itemsCssClass'=>'table table-striped table-bordered table-condensed ',
                'itemsCssClass'=>'sepGrid',
                'enablePagination' => false,
                'template'=>'{items}',
                'emptyText' => Yii::t('DTVModule.smartcards', 'There is no available channels'),
                'columns' => array(
                    array(
                        'name' => Yii::t('DTVModule.equipment', 'Channel name'),
                        'type' => 'raw',
                        'value' => 'CHtml::encode($data["catdescr"])'
                    ),
                    array(
                        'name' => Yii::t('DTVModule.smartcards', 'Above'),
                        'type' => 'raw',
                        'value' => 'CHtml::encode($data["above"])',
                        'htmlOptions' => array('width'=>100),
                    ),
                    array(
                        'name' => Yii::t('DTVModule.smartcards', 'Currency'),
                        'type' => 'raw',
                        'value' => 'CHtml::encode($data["symbol"])',
                        'htmlOptions' => array('width'=>70),
                    ),

                ),
            ));
            echo '</div>';
        }
    }


    if (!$errAdd || ($errAdd && (isset($chanelsList['remove']) === true && count($chanelsList['remove'])>0))){

        echo CHtml::hiddenField('saveTvChan',1);
        echo CHtml::submitButton(Yii::t('DTVModule.smartcards', 'Confirm'));
        echo '&nbsp;&nbsp;';
        echo CHtml::link(Yii::t('DTVModule.smartcards', 'Back'), array('/DTV/Smartcards'));
    } else {
        echo CHtml::link(Yii::t('DTVModule.smartcards', 'Back'), array('/DTV/Smartcards'));
    }



echo CHtml::endForm();
