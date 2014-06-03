<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('TurboModule.Turbo', 'TURBO-internet successfully purchased!');
    $next = true;
?>
    <fieldset>
    <h2 style="color:green;"><?php echo Yii::t('TurboModule.Turbo', 'TURBO-internet successfully purchased!');?></h2>
    <div>
        <p>
            Услуга TURBO-интернет успешно заказана!<br>
            С Вашего договора <?php echo CHtml::encode($cost['agrmNumber']); ?> списано <?php echo Yii::app()->NumberFormatter->formatCurrency($cost['totalCost'], 'RUB') ?><br>
            Для применения изменений необходимо переустановить Ваше соединение VPN.
        </p>
        <a href="<?php echo $this->createUrl('/account/index');?>"><?php echo Yii::t('TurboModule.Turbo', 'Return to the main page') ?></a>
    </div>
    </fieldset>

<?php (Yii::app()->controller->module->showCurrentTurbo) ? $this->renderPartial('_currentTurbo') : ''; ?>