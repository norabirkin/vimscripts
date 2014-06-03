<?php
$this->breadcrumbs=array(
	Yii::t('DTVModule.smartcards','TV channels'),
);

$this->widget('LB.widgets.BootAlert');
?>

<h1><?php echo Yii::t('DTVModule.smartcards','TV channels'); ?></h1>

<?php
if (count($smartcards) > 0) {
    $tabs = array();
    
    $item = Yii::app()->request->getParam('item', null);
    $activeTab = null;
    
    foreach($smartcards as $k => $card) {
        $vgid = $this->getClientVgroups($card['smartcard']['vgid']);
        if (!$vgid) continue;
        if(!$activeTab) {
            $activeTab = 'tab' . $k . '_' . $card['smartcard']['cardid'];
        }
        if ($item == $card['smartcard']['cardid']) {
            $activeTab = 'tab' . $k . '_' . $card['smartcard']['cardid'];
        }
        
        $tabs['tab' . $k . '_' . $card['smartcard']['cardid']] = array(
            'title' => CHtml::tag('span', array(), CHtml::encode(empty($card['smartcard']['name']) ? $card['smartcard']['serial'] : $card['smartcard']['name'])),
            'url' => Yii::app()->createUrl('DTV/smartcards', array(
                'item' => $card['smartcard']['cardid']
            )),
            'view' => '_channels',
            'data' => array(
                '_card' => $card,
                '_agrm' => $this->getAgrmByID($card['smartcard']['vgid'], $card['agrmnum']),
                '_vgid' => $vgid,
                //'_personal' => DTV::isPersonalTVOn($card['smartcard']['vgid'])
            )
        );
    }
    
    $this->widget('CTabView', array(
        'activeTab' => $activeTab,
        'tabs'=> $tabs
    ));
}

