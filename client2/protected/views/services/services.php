<h1><?php echo Yii::t('app', 'Services'); ?></h1>

<?php $this->widget('LB.widgets.BootAlert'); ?>

<?php
/*
    //Dependent combo
    $form=$this->beginWidget('CActiveForm');
    $model = new User;
    echo CHtml::dropDownList(
        'agrm_id',
        '', // selection
        CHtml::listData($model->getAgreements(), 'agrmid', 'number', 'operid'),
        array(
            'empty' => Yii::t('services', 'Please select item!'),
            'ajax' => array(
                'type'=>'POST', //request type
                'url'=>CController::createUrl('getVgroups'),
                //Style: CController::createUrl('currentController/methodToCall')
                'update'=>'#vgroup_id', //selector to update
                //'data'=>'js:javascript statement'
                //leave out the data key to pass all form values through
            )
        )
    );
    //echo CHtml::dropDownList('input',$sv, CHtml::listData($model->getVgroups(true), 'vgroup.agrmid', 'vgroup.login', 'vgroup.agrmid'));
    echo CHtml::dropDownList(
        'vgroup_id',
        '',
        array()
    );
    echo CHtml::dropDownList(
        'service_id',
        '',
        array()
    );
    $this->endWidget();
*/
?>

<?php if ($this->error){ $this->widget('LB.widgets.BootAlert'); } else { ?>

<?php if (!empty($this->message)) { ?>
    <div class="page-message active"><?php echo $this->message; ?> <a href="#" onclick="this.parentNode.style.display='none';return false;" class="page-message-close"></a><span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span></div>
<?php } ?>


<!--<form id="lb_docform" action="<?php echo $this->createUrl('services/index'); ?>">-->
<form id="lb_docform" action="">
<input type="hidden" value="services/index" name="r">

<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'PaymentAgreement'); ?>:</label>
    <select name="agreement" onchange="$('.content').addClass('loading'); $('#lb_docform').submit();">
    <?php foreach ($this->lanbilling->agreements as $id => $agreement) { ?>
    <?php $agrgroup = empty($agrgroup) ? '' : $agrgroup; ?>
    <?php if ($this->lanbilling->Operators[$agreement->operid]['name'] != $agrgroup) { ?>
        <?php if (!empty($agrgroup)) { ?>
        </optgroup>
        <?php } ?>
        <?php $agrgroup = $this->lanbilling->Operators[$agreement->operid]['name']; ?>
        <optgroup label="<?php echo $this->lanbilling->Operators[$agreement->operid]['name'] ?>">
        <?php } ?>
            <option value="<?php echo $id ?>"<?php echo $agr == $id ? ' selected' : '' ?>><?php echo $agreement->number; ?></option>
    <?php } ?>
        </optgroup>
    </select>

</div>


<?php 

//Выпадающий список учетных записей пользователя

 if ($agr) { /* ?>

<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'HistoryAccount') ?>:</label>
    <select class="input-select" name="vgid" onchange="$('.content').addClass('loading'); $('#lb_docform').submit();">
        <option value="0"><?php echo Yii::t('app', 'ServiceType0') ?></option>
        <?php foreach ($vgroups as $vGroup) { ?>
            <?php if (!empty($vGroup->tarstaff) || (!empty($this->lanbilling->tarifs[$vGroup->vgroup->tarifid]) && !empty($this->lanbilling->tarifs[$vGroup->vgroup->tarifid]->services_count))) { ?>
            <option value="<?php echo $vGroup->vgroup->vgid; ?>"<?php echo $vGroup->vgroup->vgid == $vgid ? ' selected' : ''; ?>><?php echo $vGroup->vgroup->login; ?></option>
            <?php } ?>
        <?php } ?>
    </select>
</div> <?php */ ?>

<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'HistoryAccount') ?>:</label>
    <select class="input-select" name="vgid" onchange="$('.content').addClass('loading'); $('#lb_docform').submit();">
        <option value="0"><?php echo Yii::t('app', 'ServiceType0') ?></option>
        <?php foreach ($tsp->vgroups as $vGroup) { ?>
            <option value="<?php echo $vGroup->vgroup->vgid; ?>"<?php echo $vGroup->vgroup->vgid == $vgid ? ' selected' : ''; ?>><?php echo $vGroup->vgroup->login; ?></option>
        <?php } ?>
    </select>
</div>

<?php } ?>

<?php 

//Выпадающий список типов действий

/*if ($vgid) { ?>
<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'ActionType'); ?>:</label>
    <select onchange="$('.content').addClass('loading');$('#lb_docform').submit();" name="service" class="input-select">
        <option value="0"<?php echo !$service ? ' selected' : ''; ?>><?php echo Yii::t('app', 'ServiceType0'); ?></option>
        <?php if (!empty($this->lanbilling->Tarif) && !empty($this->lanbilling->Tarif->tarstaff)) { ?>
            <option value="1"<?php echo $service == 1 ? ' selected' : ''; ?>><?php echo Yii::t('app', 'ChangeTarification'); ?></option>
        <?php } ?>
        <?php if (!empty($this->lanbilling->Tarif) && !empty($this->lanbilling->tarifs[$this->lanbilling->Tarif->vgroup->tarifid]->services_count)) { ?>
            <option value="2"<?php echo $service == 2 ? ' selected' : ''; ?>><?php echo Yii::t('app', 'ChangeServices'); ?></option>
        <?php } ?>
    </select>
</div>
<?php }*/ ?>

<?php 

//Выпадающий список типов действий

if ($tsp->actions) { ?>
<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'ActionType'); ?>:</label>
    <select onchange="$('.content').addClass('loading');$('#lb_docform').submit();" name="service" class="input-select">
        <option value="0"<?php echo !$service ? ' selected' : ''; ?>><?php echo Yii::t('app', 'ServiceType0'); ?></option>
        <?php foreach ($tsp->actions as $k=>$v) { ?>
        <option value="<?php echo $k ?>"<?php echo $service == $k ? ' selected' : ''; ?>><?php echo Yii::t('app', $v); ?></option>
        <?php } ?>
    </select>
</div>
<?php } ?>

</form>


<form action="">
<input type="hidden" value="services/index" name="r">


<?php echo CHtml::hiddenField('agreement', $agr);     ?>
<?php echo CHtml::hiddenField('vgid',      $vgid);    ?>
<?php echo CHtml::hiddenField('service',   $service); ?>

<?php
if ($service) {

    switch ($service) {
    case 1:
?>
    <h2><?php echo Yii::t('app', 'TarificationChange'); ?></h2>
        <?php if ($tarifs_unlimited) { ?>

        <table class="content-table">
        <tr>
            <th width="50%"><?php echo Yii::t('app', 'TarificationUC') ?></th>
            <th><?php echo Yii::t('app', 'TarificationFee') ?></th>
        </tr>
        <?php //foreach ($this->lanbilling->Tarif->tarstaff as $newTarif) {
        foreach ($tsp->current_vgroup_tarifs as $newTarif) {
            $newTarif->tardescr = $this->lanbilling->tarifs[$newTarif->tarid]->descrfull;
            //$newTarif->tarcost = $this->lanbilling->tarifs[$newTarif->tarid]->rent;
            //$newTarif->tarsymbol = $this->lanbilling->tarifs[$newTarif->tarid]->curid == 1 ? Yii::t('app', 'RUB') : Yii::t('app', 'USD');
            $newTarif->servicevolume = $this->lanbilling->tarifs[$newTarif->tarid]->trafflimit;
            if (!$newTarif->servicevolume) { ?>
            <tr>
                <td>
                    <strong>
                        <label class="form-label-block">
                            <input type="radio" name="tariff" value="<?php echo $newTarif->tarid ?>"<?php echo $newTarif->tarid==$tsp->current_vgroup->vgroup->tarifid ? ' checked' : ''; ?>> <?php echo $newTarif->tarname; ?>
                        </label>
                    </strong>
                    <?php if (!empty($newTarif->tardescr)) { echo $newTarif->tardescr; } ?>
                </td>
                <td><?php echo !isset($newTarif->rent) ? '' : round($newTarif->rent, 2) . ' ' . $newTarif->tarsymbol ?></td>
                <td><?php echo !isset($newTarif->tardescrfull) ? '' : htmlspecialchars($newTarif->tardescrfull); ?></td>
            </tr>
            <?php } ?>
        <?php } ?>
        </table>
        <?php } ?>

        <?php if ($tarifs_volume) { ?>
<table class="content-table">
<tr>
    <th width="50%"><?php echo Yii::t('app', 'TarificationUC') ?></th>
    <th><?php echo Yii::t('app', 'TarificationFee') ?></th>
    <th><?php echo Yii::t('app', 'TarificationLimitTraffic');?></th>
    <th><?php echo Yii::t('app', 'TarificationLimitTime');?></th>
</tr>
            <?php foreach ($tsp->current_vgroup_tarifs as $newTarif) {
                $newTarif->tardescr = $this->lanbilling->tarifs[$newTarif->tarid]->descrfull;
                $newTarif->tarcost = $this->lanbilling->tarifs[$newTarif->tarid]->rent;
                $newTarif->tarsymbol = $this->lanbilling->tarifs[$newTarif->tarid]->curid == 1 ? Yii::t('app', 'RUB') : Yii::t('app', 'USD');
                $newTarif->servicevolume = $this->lanbilling->tarifs[$newTarif->tarid]->trafflimit;
            ?>
                <?php if ($newTarif->servicevolume) { ?>
<tr>
    <td><strong><label class="form-label-block">
        <input type="radio" name="tariff" value="<?php echo $newTarif->tarid ?>"<?php echo $newTarif->tarid==$tsp->current_vgroup->vgroup->tarifid ? ' checked' : '' ?>> <?php echo $newTarif->tarname ?>
    </label></strong> <?php if (!empty($newTarif->tardescr)) { echo $newTarif->tardescr; } ?></td>
    <td><?php echo !isset($newTarif->tarcost) ? '' : round($newTarif->tarcost, 2) . ' ' . $newTarif->tarsymbol ?></td>
    <td><?php if ($newTarif->tartype < 2) { echo $newTarif->servicevolume . ' ' . Yii::t('app', 'MB');}?></td>
    <td><?php if ($newTarif->tartype < 5 && $newTarif->tartype > 1) { echo $newTarif->servicevolume . ' ' . Yii::t('app', 'MIN');}?></td>
</tr>
                <?php } ?>
            <?php } ?>
</table>
        <?php } ?>
<p>
    <label class="form-label"><?php echo Yii::t('app', 'TarificationSetDate') ?></label>
    <!--<input type="text" class="input-text input-date-min" name="date" value="<?php echo $date ?>">-->

    <?php
    if (!($date_strict)) {
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name'=>'date',
            'id'=>'date',
            'value'=>$date,
            'options'=>array(
                'showAnim'=>'fold',
                'minDate'=>$date,
            ),
            'htmlOptions'=>array(
                'style'=>'height:20px;',
                'class'=>'input-text',
                'readonly'=>true
            ),
        ));
    } else { ?><input type="text" readonly="readonly" class="input-text input-date-min" name="date" value="<?php echo $date ?>"><?php }
    ?>

</p>

    <p class="popup-submit">
        <input type="submit" value="<?php echo Yii::t('app', 'Save') ?>" class="input-submit" name="submit">
        <a href="<?php echo $this->createUrl('services/index');?>" class="input-cancel"><?php echo Yii::t('app', 'Cancel') ?></a>
    </p>

<?php break; ?>




<?php /* Управление услугами */ case 2: ?>
<?php
$currentServices = $this->getUSBoxForVg($vgid);
$currentServices = (is_array($currentServices) ? $currentServices : (array)$currentServices);



if (count($currentServices) > 0 && $currentServices[0]){ ?>
    <h2><?php echo Yii::t('app', 'ServicesChange') ?></h2>
    <table class="content-table">
        <tr>
            <th><?php echo Yii::t('app', 'Наименование услуги'); ?></th>
            <th><?php echo Yii::t('app', 'Стоимость'); ?></th>
            <th><?php echo Yii::t('app', 'Дата начала'); ?></th>
            <th><?php echo Yii::t('app', 'Дата окончания'); ?></th>
            <th></th>
        </tr>
    <?php
    foreach ($currentServices as $k=> $curServ){
        $used = ($curServ['serviceid'] !== 0 || $curServ['used'] == 1) ? true : false;
    ?>
        <tr>
            <td><?php
                if (!$used) { ?>
                    <label for="catidx<?php echo $curServ['catidx']; ?>"><?php echo $curServ['catdescr'] ?></label>
                <?php }
                else echo $curServ['catdescr'];
                ?>
            </td>
            <td><?php echo $curServ['above'] . ' (' . $curServ['symbol'] . ')'; ?></td>
            <td><?php echo (!empty($curServ['timefrom']) && date('Y',strtotime($curServ['timefrom'])) < 3000) ? date('d.m.Y',strtotime($curServ['timefrom'])) : ''; ?>
            </td>
            <td>
                
                <?php $d = explode('-',$curServ['timeto']);
                
                if ( $used && /*date('Y',strtotime($curServ['timeto']))*/(int) $d[0] > '3000')
                        echo Yii::t('app', 'не ограничен');
                      elseif (!$used)
                        echo '';
                      else
                        echo date('d.m.Y',strtotime($curServ['timeto']));
                ?>
            </td>
            <td width="40">
                <input type="checkbox" id="catidx<?php echo $curServ['catidx']; ?>" name = "catidx[<?php echo $curServ['catidx']; ?>]" <?php echo $used ? " checked disabled" : ''?>>
            </td>

        </tr>
    <?php

    }
?>
</table>

<p>
    <label><?php echo Yii::t('services', 'Дата начала действия услуги'); ?></label>
    <?php
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name'=>'dtfrom',
            'id'=>'dtfrom',
            'value'=>$date,
            'options'=>array(
                'showAnim'=>'fold',
                'minDate'=>$date,
            ),
            'htmlOptions'=>array(
                'style'=>'height:20px;',
                'class'=>'input-text',
                'readonly'=>true
            ),
        ));
    ?>
</p>

<p>
    <label><?php echo Yii::t('services', 'Дата окончания действия услуги'); ?></label>
    <?php
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name'=>'dtto',
            'id'=>'dtto',
            'options'=>array(
                'showAnim'=>'fold',
                'minDate'=>$date,
            ),
            'htmlOptions'=>array(
                'style'=>'height:20px;',
                'class'=>'input-text',
                'readonly'=>true
            ),
        ));
    ?>
</p>

    <p class="popup-submit">
        <input type="submit" value="<?php echo Yii::t('app', 'Save') ?>" class="input-submit" name="submit">
        <a href="<?php echo $this->createUrl('services/index');?>" class="input-cancel"><?php echo Yii::t('app', 'Cancel') ?></a>
    </p>


<?php } else { ?>
<h2><?php echo Yii::t('app', 'Нет доступных услуг.') ?></h2>
<?php } ?>

<?php break; ?>
<?php } ?>
<?php } ?>
</form>

<?php } ?>