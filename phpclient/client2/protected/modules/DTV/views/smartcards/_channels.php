
<h4><?php echo yii::t('DTVModule.smartcards', 'ActiveChannels') ?></h4>
<div class="lb_table_wrp">
<?php
$_tmp = array();
$_list = $this->getTVPackages($_card['smartcard']['vgid'], false, array( 'needcalc' => 1, 'defaultonly' => 1 ));

$_personal = (count($_list) > 0);

if(count($_list) > 0 && $_vgid) {
    foreach ($_list as $k => &$item) {
        $item = array_merge($item, array(
            'balance' => $_agrm['balance'],
            'credit' => $_agrm['credit'],
            'baltotal' => $_agrm['credit'] + $_agrm['balance']
        ));
    }
    
    if($_personal) {
        array_push($_list, array(
            'catdescr' => yii::t('DTVModule.smartcards','PersonalTV'),
            'above' => false,
            'symbol' => '',
            'vgid' => $_vgid->vgroup->vgid,
            'catidx' => -1,
            'servid' => 0,
            'available' => 1,
            'balance' => $_agrm['balance'],
            'credit' => $_agrm['credit'],
            'baltotal' => $_agrm['credit'] + $_agrm['balance']
        ));
    }

    $relatedTVPackages = new CArrayDataProvider($_list, array(
        'id' => 'smartPackages',
        'keyField' => 'catidx',
        'sort' => array(
            'attributes' => array(
                'catdescr'
             ),
         ),
         'pagination' => false
    ));
    
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'vg-smartcards-grid-disabled',
        'dataProvider' => $relatedTVPackages,
        'ajaxUpdate'=>true,
        'cssFile' => Yii::app()->theme->baseUrl. '/css/grid.css',
        //'itemsCssClass'=>'sepGrid',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('DTVModule.equipment', 'There is no available channels'),
        'columns' => array(
            array(
                'name' => Yii::t('DTVModule.equipment', 'Channel name'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["catdescr"])',
                'htmlOptions' => array('class' => 'first_col'),
                'headerHtmlOptions' => array('class' => 'first_col')
            ),
            array(
                'name' => Yii::t('DTVModule.equipment', 'Price').'<br /><span class="price_descr">'.yii::t('DTVModule.smartcards','RUBPerMonth').'</span>',
                'type' => 'raw',
                'value' => '($data["catidx"] == -1) ? "" : Yii::app()->NumberFormatter->format("#,###,###.00",$data["above"])',
                'htmlOptions' => array('class'=>'currency')
            ),
            array(
                'name' => Yii::t('DTVModule.smartcards', 'State'),
                'type' => 'raw',
                'value' => array($this,'gridStatusCol'),
                'htmlOptions' => array('width'=>90)
            ),
            array(
                'name' => '&nbsp;',
                'type' => 'raw',
                'value'=>array($this,'gridConnectCol'),
                'htmlOptions' => array('width'=>180)
            )
        )
    ));
}
else {
    echo '<em>'.Yii::t('DTVModule.smartcards','NoAvailablePackages').'</em>';
}
?>
</div>

<h4><?php echo yii::t('DTVModule.smartcards','NotConnectedChannels') ?></h4>
<div class="lb_table_wrp">
<?php

$_tmp = array();
$_list = $this->getTVPackages($_card['smartcard']['vgid'], false, array( 'needcalc' => 0, 'defaultonly' => 1 ));

if(count($_list) > 0 && $_vgid) {
    foreach ($_list as $k => &$item) {
        $item = array_merge($item, array(
            'balance' => $_agrm['balance'],
            'credit' => $_agrm['credit'],
            'baltotal' => $_agrm['credit'] + $_agrm['balance']
        ));
    }
    
    if(!$_personal) {
        array_push($_list, array(
            'catdescr' => yii::t('DTVModule.smartcards','PersonalTV'),
            'above' => false,
            'symbol' => '',
            'vgid' => $_vgid->vgroup->vgid,
            'catidx' => -1,
            'servid' => 0,
            'available' => 1,
            'balance' => $_agrm['balance'],
            'credit' => $_agrm['credit'],
            'baltotal' => $_agrm['credit'] + $_agrm['balance']
        ));
    }

    $relatedTVPackages = new CArrayDataProvider($_list, array(
        'id' => 'smartPackages',
        'keyField' => 'catidx',
        'sort' => array(
            'attributes' => array(
                'catdescr'
             ),
         ),
         'pagination' => false
    ));
    
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'vg-smartcards-grid-connected',
        'dataProvider' => $relatedTVPackages,
        'ajaxUpdate'=>true,
        'cssFile' => Yii::app()->theme->baseUrl. '/css/grid.css',
        //'itemsCssClass'=>'sepGrid',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('DTVModule.equipment', 'There is no available channels'),
        'columns' => array(
            array(
                'name' => Yii::t('DTVModule.equipment', 'Channel name'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["catdescr"])',
                'htmlOptions' => array('class' => 'first_col'),
                'headerHtmlOptions' => array('class' => 'first_col')
            ),
            array(
                'name' => Yii::t('DTVModule.equipment', 'Price').'<br /><span class="price_descr">'.yii::t('DTVModule.smartcards','RUBPerMonth').'</span>',
                'type' => 'raw',
                'value' => '($data["catidx"] == -1) ? "" : Yii::app()->NumberFormatter->format("#,###,###.00",$data["above"])',
                'htmlOptions' => array('class'=>'currency')
            ),
            array(
                'name' => Yii::t('DTVModule.smartcards', 'State'),
                'type' => 'raw',
                'value' => array($this,'gridStatusCol'),
                'htmlOptions' => array('width'=>90)
            ),
            array(
                'name' => '&nbsp;',
                'type' => 'raw',
                'value'=>array($this,'gridConnectCol'),
                'htmlOptions' => array('width'=>180)
            )
        )
    ));
}
else {
    echo '<em>'.Yii::t('DTVModule.smartcards','NoAvailablePackages').'</em>';
}
?>
</div>
