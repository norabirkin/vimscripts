<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Statistics', 'Контроль расходов');
    $this->breadcrumbs = array(
        Yii::t('Statistics', 'Статистика'),
    );
?>
<h1><?php echo Yii::t('Statistics', 'Статистика'); ?></h1>

<div class="partition">
	<h2><a href="<?php echo $this->createUrl('/statistics/StatRent');?>">Списания средств</a></h2>
	<p>Раздел содержит информацию о расходах выбранного периода периода.</p>

    <?php
        $url = array("/statistics/StatPayment");
        echo '<h2>'.CHtml::link(Yii::t('Statistics', 'История платежей'),$url,array("submit"=>$url,'params'=>array("clear" => 1))).'</h2>';
    ?>
	<p>В данном разделе Вы можете получить общую информацию о платежах.</p>

	<h2><a href="<?php echo $this->createUrl('/statistics/StatTariff');?>">История смены тарифных планов</a></h2>
	<p>В данном разделе Вы можете ознакомиться со своей историей смены тарифных планов.</p>

	<h2><a href="<?php echo $this->createUrl('/statistics/index');?>">Блокировки учетных записей</a></h2>
	<p>В данном разделе Вы можете просмотреть информацию о прошедших и действующих блокировках.</p>

<?php
if (count($model->getAvailableMenu())){
    foreach ($model->getAvailableMenu() as $typeId){
        switch ($typeId) {
            case 1:
            ?>
                <h2><a href="<?php echo $this->createUrl('/statistics/StatTraff');?>">Статистика по трафику</a></h2>
                <p>Детальная информация об интернет трафике за выбранный период.</p>
            <?php
            break;

            case 2:
            ?>
                <h2><a href="<?php echo $this->createUrl('/statistics/StatTime');?>">Временная статистика</a></h2>
                <p>Детализация по Вашим звонкам.</p>
            <?php
            break;
            case 3:
            ?>
                <h2><a href="<?php echo $this->createUrl('/statistics/StatServices');?>">Статистика по потребленным услугам</a></h2>
                <p>Информация по списаниям за переодические и разовые услуги.</p>
            <?php
            break;
        }
    }
}
?>

</div>
