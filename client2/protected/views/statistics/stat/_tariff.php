<?php
$this->breadcrumbs=array(
    Yii::t('Statistics','Статистика') => array('/statistics'),
	Yii::t('Statistics','История смены тарифных планов'),
);
?>
<h1><?php echo Yii::t('Statistics', 'История смены тарифных планов'); ?></h1>

<strong><small><?php echo Yii::t('Statistics', 'Выберите учетную запись для просмотра детальной статистики.'); ?></small></strong>
<style>
table {
	border-spacing: 3px!important;
	border-collapse: separate!important;
}
</style>

<?php
    $traffVgroups = '';
    if (count(Arr::obj2arr($model->accVg['service'][1]))) {
        foreach (Arr::obj2arr($model->accVg['service'][1]) as $type => $item){
            $traffVgroups[] = $item['vgroup'];
        }
    }
    $data = new CArrayDataProvider($traffVgroups, array(
        'id'=>'traffVgroups',
        'keyField' => 'vgid',
        'sort'=>array(
            'attributes'=>array(
                'login'
            ),
        ),
        'pagination'=>array(
            'pageSize'=>Yii::app()->params['PageLimit'],
        ),
    ));
    echo '<div class="gridium">';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'traff-grid',
        'dataProvider' => $data,
        'ajaxUpdate'=>true,
        'itemsCssClass'=>'sepGrid',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('Statistics', 'Нет доступных учетных записей'),
        'columns' => array(
            array(
                'name' => Yii::t('Statistics', 'Учетная запись'),
                'type' => 'raw',
                'value'=>array($this,'getDetailLoginLink'),
            ),
            array(
                'name' => Yii::t('Statistics', 'Договор'),
                'type' => 'raw',
                'value'=> 'CHtml::encode(Yii::app()->controller->lanbilling->agreements[$data["agrmid"]]->number)',
            ),
            array(
                'name' => Yii::t('Statistics', 'Текущий тариф'),
                'type' => 'raw',
                'value'=> 'CHtml::encode($data["tarifdescr"])'
            ),
            array(
                'name' => Yii::t('Statistics', 'Абонентская плата'),
                'type' => 'raw',
                'value'=> 'Yii::app()->NumberFormatter->formatCurrency($data["servicerent"], Yii::app()->params["currency"])',
                'htmlOptions' => array(
                    'class'=>'currency'
                ),
            ),
            array(
                'name' => Yii::t('Statistics', 'Остаток предоплаченной услуги'),
                'type' => 'raw',
                'value'=> 'CHtml::encode($data["servicevolume"])',
                'htmlOptions' => array('class'=>'currency'),
            ),
            array(
                'name' => Yii::t('Statistics', 'Израсходовано услуги (Мб)'),
                'type' => 'raw',
                'value'=> '($data["serviceusedin"] >= 0) ? $data["serviceusedin"] : "-"',
                'htmlOptions' => array(
                    'class'=>'currency'
                ),
            ),
            array(
                'name' => Yii::t('Statistics', 'Состояние'),
                'type' => 'raw',
                'value'=>array($this,'getStatusByBlockId'),
                'htmlOptions' => array(
                    'class'=>'currency'
                ),
            ),
        ),
    ));
    echo '</div>';
?>