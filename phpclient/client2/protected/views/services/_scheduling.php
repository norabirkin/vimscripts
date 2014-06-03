<?php
    //$data = $model->getTariffsRasp( $vgid );
    if (count($data) > 0)
    {
    ?>
    <h2 class="steps">
        <?php echo Yii::t('Services', 'Запланированные смены тарифного плана.'); ?>
    </h2>

    <?php
    $dp = new CArrayDataProvider($data, array(
        'id'=>'traffRasp',
        'keyField' => 'recordid',
        'sort'=>array(
            'attributes' => array(
                'changetime', 'tarnewname', 'recordid'
            ),
        ),
        'pagination' => false,
    ));
    echo '<div class="gridium">';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'tarRasp-grid',
        'dataProvider' => $dp,
        'ajaxUpdate'=>true,
        'itemsCssClass'=>'sepGrid',
        'enablePagination' => false,
        'template'=>'{items}',
        'emptyText' => Yii::t('Services', 'На данный момент нет запланированных смен тарифных планов.'),
        'columns' => array(
            array(
                'name' => Yii::t('Services', 'Дата смены'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["changetime"])',
            ),
            array(
                'name' => Yii::t('Services', 'Тарифный план'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["tarnewname"])'
            ),
            array(
                'name' => Yii::t('Services', 'Запланирован'),
                'type' => 'raw',
                'value' => '($data["requestby"] >= 0) ? Yii::t("Services","Менеджером") : Yii::t("Services","Пользователем");'
            ),
            array(
                'name' => Yii::t('Services', 'Действия'),
                'type' => 'raw',
                'value'=>array($this,'dropRaspLink'),
            ),
        ),
    ));
    echo '</div>';
    ?>


<?php

    }
?>