<h2><?php echo Yii::t('TurboModule.Turbo', 'TURBO-internet'); ?></h2>
<?php

$this->breadcrumbs = array(
	//Yii::t('TurboModule.Turbo','Services'),
    Yii::t('TurboModule.Turbo','TURBO-internet'),
);

$this->widget('LB.widgets.BootAlert');


echo CHtml::beginForm();
?>
<script>
function showServices(obj){
    if(obj>0){
        document.getElementById('SERVICE_DIV').style.display="block";
        return false;
    }else{
        document.getElementById('SERVICE_DIV').style.display="none";
        return false;
    }
}
function showServicesAmount(obj){
    if(obj>0){
        document.getElementById('SERVICE_AMOUNT_DIV').style.display="block";
        document.getElementById('BUTTON_DIV').style.display="block";

        return false;
    }else{
        document.getElementById('SERVICE_AMOUNT_DIV').style.display="none";
        document.getElementById('BUTTON_DIV').style.display="none";
        return false;
    }
}
</script>


<?php 

echo CHtml::errorSummary($model,'<b>'.Yii::t('TurboModule.Turbo', 'Ошибка сохранения данных!').'</b>','',array('class'=>'alert alert-error')); ?>

<div>
    <?php echo CHtml::activeLabel($model,'vgroup'); ?>
    <div>
        <?php
            echo CHtml::activeDropDownList(
                $model,
                'vgroup',
                $avlVgroups,
                array(
                    'onchange'=>'return showServices(this.value)',
                    //'empty' => Yii::t('TurboModule.Turbo', 'Select account'),
                    'prompt'=>'Select',
                    'ajax' => array(
                        'type'=>'POST',
                        'dataType'=>'json',
                        'url'=>CController::createUrl('turbo/getservices',array()),
                        'update'=>'#_service',
                        'data'=>array('vgid'=>'js:this.value'),
                        'success'=>'function(data) {
                            alert("333222");
                        }',
                    )
                )
            );
        ?>
    </div>
</div>
<div id="SERVICE_DIV" style="display:none">
    <?php echo CHtml::activeLabel($model,'service'); ?>
    <div>
        <?php
            echo CHtml::activeDropDownList(
                $model,
                'service',
                $avlServices,
                array(
                    'onchange'=>'return showServicesAmount(this.value)',
                    //'empty' => Yii::t('TurboModule.Turbo', 'Select account'),
                    'prompt'=>'Select'
                )
            );
        ?>
    </div>
</div>
<div id="SERVICE_AMOUNT_DIV" style="display:none">
    <?php echo CHtml::activeLabel($model,'service_amount'); ?>
    <div>
        <?php echo CHtml::error($model,'service_amount'); ?>
        <?php echo CHtml::activeTextField($model,'service_amount'); ?>
    </div>
</div>
<div style="padding-top: 10px; display:none;" id="BUTTON_DIV">
    <?php
        echo CHtml::submitButton(Yii::t('TurboModule.Turbo', 'Заказать'));
        echo '<br/>';
        if (Yii::app()->controller->module->description)
            echo 'Нажимая кнопку "Заказать", Вы принимаете наши ' . CHtml::link(Yii::t('TurboModule.Turbo', 'условия'),array('turbo/description'), array('style'=>'font-weight: bold;')) . '.';
    ?>
</div>

<?php
echo CHtml::endForm();


    echo '<h2>'.Yii::t('TurboModule.Turbo', 'Current turbo services').'</h2>';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'turbo-grid',
        'dataProvider' => $turboList,
        'itemsCssClass'=>'table table-striped table-bordered table-condensed ',
        'enablePagination' => false,
        'template'=>'{items}',
        'columns' => array(
            array(
                'name' => Yii::t('TurboModule.Turbo', 'Start date'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["timefrom"])'
            ),
            array(
                'name' => Yii::t('TurboModule.Turbo', 'End date'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["timeto"])'
            ),
            array(
                'name' => Yii::t('TurboModule.Turbo', 'Login'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["login"])',
            ),
            array(
                'name' => Yii::t('TurboModule.Turbo', 'Shape'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["shape"])',
            ),
            array(
                'name' => Yii::t('TurboModule.Turbo', 'Description'),
                'type' => 'raw',
                'value' => 'CHtml::encode($data["descr"])',
            )
        ),
    ));
