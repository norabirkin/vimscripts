<?php
    $data = $model->getAvailablePromoByParam();

    if (isset($data[0]['name'])){
        $action = $data[0]['name'];
        $actionDescr = $data[0]['descr'];
    } else {
        $action = '';
        $actionDescr = '';
    } ?>

<?php

if ($model->promoType == 3) {
        $subtitle = Yii::t('promo','ChooseVGroupTitle',array('{action}'=>$action));
}
if ($model->promoType == 2) {
        $subtitle = Yii::t('promo','ChooseAgreementTitle',array('{action}'=>$action));
}

$this->pageTitle=Yii::app()->name . ' - ' . $subtitle;
$this->breadcrumbs=array(
    Yii::t('promo','Promo') => array('/promo'),
    $subtitle,
);
$this->widget('LB.widgets.BootAlert');
?>
<div class="main-content">

<h1><?php echo Yii::t('promo','Promo'); ?></h1>


<em><?php echo $actionDescr; ?></em><br/><br/>
<?php

    if ($model->promoType == 3) {
        echo '<h4>'. $subtitle .'</h4>';
    }
    if ($model->promoType == 2) {
        echo '<h4>'. $subtitle .'</h4>';
    }
    $vgData = array();
    if ($model->promoType == 3)
    {
        foreach ($model->getClientVgroupsArr() as $vgroup){
            $vgData[$vgroup->vgroup->vgid] = $vgroup->vgroup->login;
        }
    }

    $cData = array();
    if (count($data) > 0)
    {
        foreach ($data as $k => $val){
            $cData[] = array(
                'agrmid' => $val['agrmid'],
                'vgid' => $val['vgid'],
                'recordid' => $val['recordid'],
                'name' => $val['name'],
                'fullname' => (in_array($val['vgid'],array_keys($vgData))) ? $vgData[$val['vgid']] : '',
            );

        }
    }

    $dp = new CArrayDataProvider($cData, array(
        'id'=>'traffRasp',
        'keyField' => 'recordid',
        'pagination' => false,
    ));

    switch ($model->promoType)
    {
        // Договор
        case 2:
            $columns = array(
                array(
                    'name' => Yii::t('promo', 'Agreement'),
                    'type' => 'raw',
                    'value'=>array($this,'applyActionSelLink'),
                    'htmlOptions' => array('class' => 'first_col'),
                    'headerHtmlOptions' => array('class' => 'first_col')
                ),
            );
        break;
        // У.З.
        case 3:
            $columns = array(
                array(
                    'name' => Yii::t('promo', 'VGroup'),
                    'type' => 'raw',
                    'value'=>array($this,'applyActionSelLink'),
                    'htmlOptions' => array('class' => 'first_col'),
                    'headerHtmlOptions' => array('class' => 'first_col')
                ),
            );
        break;
    }

    echo '<div class="lb_table_wrp">';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'actions-grid',
        'dataProvider' => $dp,
        'ajaxUpdate'=>true,
        'cssFile' => Yii::app()->theme->baseUrl. '/css/grid.css',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('promo', 'NoPromo'),
        'columns' => $columns
    ));
    echo '</div>';
?>
</div>

