<?php
    //echo $total;
    echo '<div class="gridium">';
    $this->widget('zii.widgets.grid.CGridView', array(
        'id' => 'stat-grid',
        'dataProvider' => $data,
        'itemsCssClass'=>'sepGrid',
        'enablePagination' => true,
        'template'=>'{summary} {pager} <br/> {items} <br/> {pager}',
        'summaryText'=>'Записи {start} &mdash; {end} из {count}',
        'pager' => array(
            'firstPageLabel' => '<<',
            'prevPageLabel'  => '<',
            'nextPageLabel'  => '>',
            'lastPageLabel'  => '>>',
            'header'=>'Страницы',
        ),
        'emptyText' => Yii::t('Statistics', 'Нет данных за выбранный период.'),
        'columns' => $columns,
    ));
    echo '</div>';

    //$pages = $data->getPagination();
    //$this->widget('CLinkPager', array(
    //    'currentPage'=>$pages->getCurrentPage(),
    //    'itemCount'=>$pages->getItemCount(),
    //    'pageSize'=>Yii::app()->params['PageLimit'],
    //    'maxButtonCount'=>5,
    //    //'htmlOptions'=>array('class'=>'pages'),
    //));