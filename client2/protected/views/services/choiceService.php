<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Изменение тарифного плана');
    $this->breadcrumbs = array(
        Yii::t('Services', 'Тарифы и услуги') => array('/services'),
        Yii::t('Services', 'Подключение услуг'),
    );
    $this->widget('LB.widgets.BootAlert');
    $selectedVG = $model->getVgWithTariffs( true,false,'services' );
?>

<div class="main-content">

<h1><?php echo Yii::t('Services', 'Подключение услуг'); ?></h1>

<?php
    // Таблица с расписанием смены ТП
    echo $schedule;
    //$this->renderPartial('_scheduling',array('model'=>$model,'vgid'=>$model->vgid));
?>

<span class="image steps step-2-of-4" title="Шаг 2 из 4"></span>

<h2 class="steps">
	Шаг 2.&nbsp;Подключение услуг  для <?php echo $selectedVG->vgroup->login; ?>
</h2>
<br/>

<?php
    
    $servicesList = $model->getUSBoxForVg();
    if (!$servicesList) $servicesList = array();
    //print_r($servicesList);
    //die();
    
    /*$tblData = (is_array($selectedVG->tarstaff)) ? $selectedVG->tarstaff : array($selectedVG->tarstaff);
    $tarList = array();
    foreach (Arr::obj2arr($tblData) as $avlTariff){
        if ($selectedVG->vgroup->tarifid == $avlTariff['tarid']) continue;
        if ($model->get_scheduled_by_user()) $avlTariff['disabled'] = true;
        $tarList[] = $avlTariff;
    }*/

    $dp = new CArrayDataProvider($servicesList, array(
        'id'=>'servicesDetail',
        'keyField' => 'catidx',
        'pagination' => false,
    ));
    
    echo '<h4>Подключенные услуги</h4>';

    echo '<div class="gridium">';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'tar-grid',
        'dataProvider' => $dp,
        'ajaxUpdate'=>true,
        'itemsCssClass'=>'sepGrid',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('Services', 'На данный момент нет доступных услуг :\'('),
        'columns' => array(
            array(
                'name' => Yii::t('Services', 'Наименование услуги'),
                'type' => 'raw',
                //'value' => 'CHtml::encode($data["catdescr"])'
                'value'=>'CHtml::encode($data["catdescr"])',
                'htmlOptions' => array('class' => 'name_col')
            ),
            //array(
            //    'name' => Yii::t('Services', 'Описание тарифа'),
            //    'type' => 'raw',
            //    'value' => 'CHtml::encode($data["tardescrfull"])'
            //),
            array(
                'name' => Yii::t('Services', 'Стоимость'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["above"]) . " (" . CHtml::encode($data["symbol"]) . ")"'
            ),
            array(
                'name' => Yii::t('Services', 'Дата начала'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["timefrom"])'
            ),
            array(
                'name' => Yii::t('Services', 'Дата окончания'),
                'type' => 'raw',
                'value' => array($model,'serviceTimeto')
            ),
            array(
                'name' => Yii::t('Services', 'Отключить'),
                'type' => 'raw',
                'value' => array($model,'serviceStopLink')
            )
            
            //array(
            //    'name' => Yii::t('Promo', 'Скорость'),
            //    'type' => 'raw',
            //    'value' => 'CHtml::encode($data["shape"])'
            //),
            //array(
            //    'name' => Yii::t('Services', 'Действия'),
            //    'type' => 'raw',
            //    'value'=>array($this,'applyLink'),
            //),
        ),
    ));
    echo '</div>';
    
    
    $servicesList = $model->getUSBoxForVg(false);
    if (!$servicesList) $servicesList = array();
    //echo print_r($servicesList);
    //die();
    
    /*$tblData = (is_array($selectedVG->tarstaff)) ? $selectedVG->tarstaff : array($selectedVG->tarstaff);
    $tarList = array();
    foreach (Arr::obj2arr($tblData) as $avlTariff){
        if ($selectedVG->vgroup->tarifid == $avlTariff['tarid']) continue;
        if ($model->get_scheduled_by_user()) $avlTariff['disabled'] = true;
        $tarList[] = $avlTariff;
    }*/

    $dp = new CArrayDataProvider($servicesList, array(
        'id'=>'servicesDetail',
        'keyField' => 'catidx',
        'pagination' => false,
    ));
    
    echo '<h4>Не подключенные услуги</h4>';

    echo '<div class="gridium">';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'tar-grid',
        'dataProvider' => $dp,
        'ajaxUpdate'=>true,
        'itemsCssClass'=>'sepGrid',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('Services', 'На данный момент нет доступных услуг :\'('),
        'columns' => array(
            array(
                'name' => Yii::t('Services', 'Наименование услуги'),
                'type' => 'raw',
                //'value' => 'CHtml::encode($data["catdescr"])'
                'value'=>'CHtml::encode($data["catdescr"])',
                'htmlOptions' => array('class' => 'name_col')
            ),
            //array(
            //    'name' => Yii::t('Services', 'Описание тарифа'),
            //    'type' => 'raw',
            //    'value' => 'CHtml::encode($data["tardescrfull"])'
            //),
            array(
                'name' => Yii::t('Services', 'Стоимость'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["above"]) . " (" . CHtml::encode($data["symbol"]) . ")"'
            ),/*,
            array(
                'name' => Yii::t('Services', 'Дата начала'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["timefrom"])'
            ),
            array(
                'name' => Yii::t('Services', 'Дата окончания'),
                'type' => 'raw',
                'value' => array($model,'serviceTimeto')
            ),*/
            array(
                'name' => Yii::t('Services', 'Подключить'),
                'type' => 'raw',
                'value' => array($model,'serviceApplyLink')
            )
            
            //array(
            //    'name' => Yii::t('Promo', 'Скорость'),
            //    'type' => 'raw',
            //    'value' => 'CHtml::encode($data["shape"])'
            //),
            //array(
            //    'name' => Yii::t('Services', 'Действия'),
            //    'type' => 'raw',
            //    'value'=>array($this,'applyLink'),
            //),
        ),
    ));
    echo '</div>';
    
    
    
?>

<?php echo CHtml::link(Yii::t('Services', 'Вернуться к выбору учетной записи'), array('/services/services')); ?>

</div>