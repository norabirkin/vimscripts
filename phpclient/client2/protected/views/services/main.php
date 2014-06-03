<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('tariffs_and_services', 'TariffsAndServices');
    $this->breadcrumbs = array(
        Yii::t('tariffs_and_services', 'TariffsAndServices'),
    );

    $this->widget('LB.widgets.BootAlert');
?>
<h1><?php echo Yii::t('tariffs_and_services', 'TariffsAndServices'); ?></h1>

<div class="partition">
    <?php
        if (Yii::app()->params['vgroup_schedule'] AND Yii::app()->params['services_allow_change_tarif'])//Yii::app()->params['services_allow_change_tarif'])
        {
            $url = array("/services/tariff");
            echo '<h2>'.CHtml::link(Yii::t('tariffs_and_services', 'TariffChange'),$url,array("submit"=>$url,'params'=>array("clear" => 1))).'</h2>';
            echo '<p>'.Yii::t('tariffs_and_services', 'TariffChangeDescription').'</p>';
        }

        if (Yii::app()->params['services_allow_purchase_services'])
        {
            $url = array("/services/services");
            echo '<h2>'.CHtml::link(Yii::t('tariffs_and_services', 'ServiceManagement'),$url,array("submit"=>$url,'params'=>array("clear" => 1))).'</h2>';
            echo '<p>'.Yii::t('tariffs_and_services', 'ServiceManagementDescription').'</p>';
        }
		
	if (Yii::app()->params['vgroup_change_status'])
	{
            $url = array("/services/block");
            echo '<h2>'.CHtml::link(Yii::t('tariffs_and_services', 'UsersBlock'),$url,array("submit"=>$url,'params'=>array("clear" => 1))).'</h2>';
            echo '<p>'.Yii::t('tariffs_and_services', 'UsersBlockDescription').'</p>';
	}
    ?>
</div>
