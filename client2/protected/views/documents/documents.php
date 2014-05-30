<h1><?php echo Yii::t('app', 'Documents'); ?></h1>

<?php if ($this->error){ $this->widget('LB.widgets.BootAlert'); } else {
    //if (!count($this->lanbilling->orders))
    //    Yii::app()->user->setFlash('warning',Yii::t('app','Данных за период с ' . $dtfrom . ' по ' . $dtto . ' не найдено.'));
?>


<?php $this->widget('LB.widgets.BootAlert'); ?>

<?php echo CHtml::beginForm($this->createUrl('documents/index'),'get',array('id'=>'lb_docform')); ?>

<?php if (!empty($this->message)) { ?>
<div class="page-message active"><?php echo $this->message; ?> <a href="#" onclick="this.parentNode.style.display='none';return false;" class="page-message-close"></a><span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span></div>
<?php } ?>


<?php if(Yii::app()->user->hasFlash('message')):?>
    <div class="page-message active">
        <?php echo Yii::app()->user->getFlash('message');?>    <a class="page-message-close" onclick="this.parentNode.style.display='none';return false;" href="#"></a>
        <span class="cwlg c15"><span class="ctl"></span><span class="ctr"></span><span class="cbl"></span><span class="cbr"></span></span>
    </div>
<?php endif;?>

<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'BillAgreements'); ?>:</label>
    <select class="input-select" name="agreement" onchange2="$('.content').addClass('loading');$('#lb_docform').submit();">
        <option value="-1"><?php echo Yii::t('app', 'ServiceType0'); ?></option>
        <option value="0"<?php echo isset($_GET['agreement']) && !$agr ? ' selected' : '' ?>><?php echo Yii::t('app', 'BillAll'); ?></option>
        <?php foreach ($this->lanbilling->agreements as $id => $agreement) {
            $balance = empty($balance) ? $agreement->balance . " " . $agreement->symbol : $balance;
            $agrgroup = empty($agrgroup) ? '' : $agrgroup;
            if ($this->lanbilling->Operators[$agreement->operid]['name'] != $agrgroup) {
                if (!empty($agrgroup)) { ?>
                </optgroup>
                <?php }
                $agrgroup = $this->lanbilling->Operators[$agreement->operid]['name']; ?>
                <optgroup label="<?php echo $this->lanbilling->Operators[$agreement->operid]['name'] ?>">
                <?php } ?>
                    <option value="<?php echo $id; ?>"<?php echo ($agr == $id) ? ' selected' : ''; ?>><?php echo $agreement->number; ?></option>
        <?php } ?>
        </optgroup>
    </select>
</div>
<div class="form-line">

    <label class="form-label"><?php echo Yii::t('app', 'DocumentsPeriod'); ?>:</label>
    <?php
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name'=>'dtfrom',
            'id'=>'date-from',
            'value'=> ($dtfrom) ? $dtfrom : '',
            'options'=>array(
                'showAnim'=>'fold'
            ),
            'htmlOptions'=>array(
                'style'=>'height:20px;',
                'class'=>'input-text input-date-from',
                'readonly'=>true
            ),
        ));
    ?>
    &mdash;
    <?php
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name'=>'dtto',
            'id'=>'input-date-to',
            'value'=> ($dtto) ? $dtto : '',
            'options'=>array(
                'showAnim'=>'fold'
            ),
            'htmlOptions'=>array(
                'style'=>'height:20px;',
                'class'=>'input-text input-date-to',
                'readonly'=>true
            ),
        ));
    ?>
    <span class="form-note form-dates">
        <a href="#" class="pseudo" onclick="$('#date-from').val('<?php echo date('d.m.Y', strtotime('-7 days')); ?>');"><?php echo Yii::t('app', 'Period1'); ?></a>
        <a href="#" class="pseudo" onclick="$('#date-from').val('<?php echo date('d.m.Y', strtotime('-1 month')); ?>');"><?php echo Yii::t('app', 'Period2'); ?></a>
        <a href="#" class="pseudo" onclick="$('#date-from').val('<?php echo date('d.m.Y', strtotime('-3 month')); ?>');"><?php echo Yii::t('app', 'Period3'); ?></a>
        <a href="#" class="pseudo" onclick="$('#date-from').val('<?php echo date('d.m.Y', strtotime('-6 month')); ?>');"><?php echo Yii::t('app', 'Period4'); ?></a>
        <a href="#" class="pseudo" onclick="$('#date-from').val('<?php echo date('d.m.Y', strtotime('-12 month')); ?>');"><?php echo Yii::t('app', 'Period5'); ?></a>
    </span>

</div>


<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'DocumentsType'); ?>:</label>
    <select class="input-select" name="type" onchange2="$('.content').addClass('loading');$('#lb_docform').submit()">
        <option value="-1"><?php echo Yii::t('app', 'ServiceType0'); ?></option>
        <option value="0"<?php echo isset($_GET['type']) && !$type ? ' selected' : '' ?>><?php echo Yii::t('app', 'BillAll'); ?></option>
<?php foreach ($this->lanbilling->documents as $document) { ?>
        <option value="<?php echo $document->docid; ?>"<?php echo $type == $document->docid ? ' selected' : '' ?>><?php echo $document->name; ?></option>
<?php } ?>
    </select>
</div>

<div class="form-line">
    <label class="form-label"><?php echo Yii::t('app', 'DocumentsStatus'); ?>:</label>
    <select class="input-select" name="status" onchange2="$('.content').addClass('loading');$('#lb_docform').submit()">
        <option value="-1"><?php echo Yii::t('app', 'ServiceType0'); ?></option>
        <option value="0"<?php echo isset($_GET['status']) && !$status ? ' selected' : '' ?>><?php echo Yii::t('app', 'BillAll'); ?></option>
        <option value="1"<?php echo $status == 1 ? ' selected' : '' ?>><?php echo Yii::t('app', 'BillNotPaid'); ?></option>
        <option value="2"<?php echo $status == 2 ? ' selected' : '' ?>><?php echo Yii::t('app', 'BillPaid'); ?></option>
    </select>
</div>

<div class="form-line">
    <?php echo CHtml::submitButton(Yii::t('app', 'ContentFilter')); ?>
</div>

</form>
<?php if (count($this->lanbilling->orders)) { ?>
<?php //Dumper::dump($this->lanbilling->orders); ?>
<table class="content-table" id="new">
<thead>
<tr>
    <th><?php echo Yii::t('app', 'BillDate'); ?></th>
    <th><?php echo Yii::t('app', 'Номер документа'); ?></th>
    <th><?php echo Yii::t('app', 'Документ'); ?></th>
    <th><?php echo Yii::t('app', 'BillSum'); ?></th>
    <th><?php echo Yii::t('app', 'DocumentsStatusShort'); ?></th>
    <th>&nbsp;</th>
</tr>
</thead>
<tbody>
<?php foreach ($this->lanbilling->orders as $order) { ?>
<tr>
    <td><?php echo $this->formatDate(strtotime($order['orderdate']), 2); ?></td>
    <td><?php echo $order['ordernum']; ?></td>
    <td><?php echo $order['docname']; ?></td>
    <td><?php echo $order['currsumm']; ?></td>
    <td><?php echo Yii::t('app', $order['paid'] ? 'BillPaid' : 'BillNotPaid'); ?></td>
    <td>
        <?php
            $info = pathinfo($order['filename']);
            $file2download =  basename($order['filename'],'.'.$info['extension']);
        ?>
        <a href="<?php echo $this->createUrl('documents/download',array('file' => $file2download)); ?>" class="pseudo">
            <?php echo Yii::t('app', 'BillDownload'); ?>
        </a>
    </td>

</tr>
<?php } ?>
</tbody>
</table>

<p>
    <?php
    $nDat = array();
    if ($new){
        $nDat = array('new'=>1);
    }

    if (!empty($this->page)) { ?>
        <a href="<?php echo $this->createUrl('documents/index', $nDat);?><?php echo $this->page == 1 ? '' : '&page=' . ($this->page-1); ?>&agreement=<?php echo round($agr); ?>&dtfrom=<?php htmlspecialchars($dtfrom); ?>&dtto=<?php echo htmlspecialchars($dtto); ?>&type=<?php echo round($type); ?>&status=<?php echo round($status); ?>" class="pseudo content-table-pages-link content-table-pages-prev">&laquo;&nbsp;<?php echo Yii::t('app', 'HistoryPrevious'); ?> <?php //echo yii::app()->params['PageLimit']; ?></a>&nbsp;&nbsp;&nbsp;
    <?php } ?>
    <?php foreach ($this->lanbilling->pages as $page) { ?>
        <?php if ($page > 1 && $page - $last_page > 1) { ?> &hellip; <?php } ?>
        <?php $last_page = $page; ?>
        <?php if ($page != $this->page + 1) { ?>
        <a href="<?php echo $this->createUrl('documents/index', $nDat);?>&page=<?php echo $page - 1 ?>&agreement=<?php echo round($agr);?>&dtfrom=<?php echo htmlspecialchars($dtfrom);?>&dtto=<?php echo htmlspecialchars($dtto);?>&type=<?php echo round($type);?>&status=<?php echo round($status);?>" class="pseudo content-table-pages-link"><?php echo $page; ?></a>
        <?php } else { ?>
        <strong class="content-table-pages-link"><?php echo $page; ?></strong>
        <?php } ?>
    <?php } ?>
    <?php if ($this->lanbilling->ordersTotal > (empty($this->page) ? 1 : $this->page+1) * yii::app()->params['PageLimit']) { ?>
        <a href="<?php echo $this->createUrl('documents/index', $nDat);?>&page=<?php echo empty($this->page) ? 1 : $this->page+1 ?>&agreement=<?php echo round($agr); ?>&dtfrom=<?php echo htmlspecialchars($dtfrom); ?>&dtto=<?php echo htmlspecialchars($dtto); ?>&type=<?php echo round($type); ?>&status=<?php echo round($status); ?>" class="pseudo content-table-pages-link content-table-pages-next"><?php echo Yii::t('app', 'HistoryNext'); ?> <?php //echo yii::app()->params['PageLimit']; ?>&nbsp;&raquo;</a>
    <?php } ?>
    <?php if ($this->lanbilling->totalPages > 1) { ?>
    (<?php echo $this->lanbilling->totalPages; ?> <?php echo Yii::t('app', 'pages' . ($this->lanbilling->totalPages%100 > 20 || $this->lanbilling->totalPages < 10 ? $this->lanbilling->totalPages%10 : 5)); ?>)
    <?php } ?>
</p>
<?php } else { ?>
    <?php echo Yii::t('app', 'NothingFound'); ?>
<?php } ?>
<?php } ?>
