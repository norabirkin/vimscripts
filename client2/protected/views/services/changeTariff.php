<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('Services', 'Изменение тарифного плана');
    $this->breadcrumbs = array(
        Yii::t('Services', 'Тарифы и услуги') => array('/services'),
        $section_name.': '.Yii::t('Services', 'Выбор Учетной Записи'),
    );

    $this->widget('LB.widgets.BootAlert');
?>

<div class="main-content">

<h1 class="step_title"><?php echo $section_name.': Шаг 1. '.Yii::t('Services', 'Выбор Учетной Записи'); ?></h1>

<?php
//$vglist = $model->getVgWithTariffs();
if (is_array($vglist) && count($vglist) > 0)
{

?>

<!--<br/>-->
<span class="image steps step-1-of-4" title="Шаг 1 из 4"></span>
<div><?php echo $descr; ?></div>
<!--<h2 class="steps">
	Шаг 1.&nbsp;Выбор Учетной Записи
</h2>-->
<br/>
<?php echo $grids;


/*
   
    foreach (array_keys($vglist) as $curAgrm)
    {
        echo '<h3>Договор: '.Yii::app()->controller->lanbilling->agreements[$curAgrm]->number.'</h3>';
    ?>
    <br/>
    <div class='gridium'>
    <table>
        <thead>
            <tr>
                <th class=""><?php echo Yii::t('Services', 'Услуга'); ?></th>
                <th class=""><?php echo Yii::t('Services', 'Учетная запись'); ?></th>
                <th class=""><?php echo Yii::t('Services', 'Текущий тарифный план'); ?></th>
                <th class=""><?php echo Yii::t('Services', 'Абонентская плата'); ?></th>
                <!--<th class=""><?php echo Yii::t('Services', 'Доступные для смены тарифы'); ?></th>-->
            </tr>
        </thead>
        <tbody>
    <?php
        foreach($vglist[$curAgrm] as  $vgData)
        {
            ?>
        <tr>
            <td><?php echo $vgData['agentdescr']; ?></td>
            <td>
                <?php

                $url = array($item_path);
                echo CHtml::link(
                    (!empty($vgData['login'])) ? $vgData['login'] : '<i>' . Yii::t('Services', 'логин не назначен') . '</i>',
                    $url,
                    array(
                        "submit"=>$url,
                        'params'=>array(
                            "vgid"    => $vgData["vgid"],
                            "login"    => $vgData["login"],
                            "clear" => 1
                        )
                    )
                );
                ?>
            </td>
            <td>
                <?php
                    echo $vgData['tarifdescr'];
                    // Запланированный тариф
                    //if (isset($vgData['tarrasp']))
                    //
                ?>
            </td>
            <td><?php echo $vgData['servicerent']; ?></td>
            <!--<td>-->
                <?php

                    //$tblData = (is_array($vgData['availabletarifs'])) ? $vgData['availabletarifs'] : array($vgData['availabletarifs']);
                    //$tarList = array();
                    //foreach ($vgData['availabletarifs'] as $allowTariff){
                    //    if ($vgData['tarifid'] == $allowTariff['tarid']) continue;
                    //    echo $allowTariff['tarname'].'<br/>';
                    //}
                ?>
            <!--</td>-->
        </tr>
            <?php
            echo '';
        }
    ?>
        </tbody>
        <tfoot>
        </tfoot>
    </table>
    </div>
    <br/>
    <?php
    } */
} else {

    echo Yii::t('Services', 'Нет учетных записей, для которых возможна смена тарифа!');
    echo '<br/>';
    echo CHtml::link(Yii::t('Services', 'Вернуться на главную'), array('/account/index'));

}
?>


</div>
