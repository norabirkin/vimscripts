<?php

class LB_Style {
    static public function info($url) {
        if (!$url) {
            return '';
        }
        return '&nbsp;&nbsp;'.CHtml::link(
            CHtml::image(
                yii::app()->theme->baseUrl.'/i/b_info.gif','info'
            ),
            $url,
            array(
                'class' => 'no_border',
                'target' => '_blank'
            )
        );
    }
    static public function warning($text) {
        return '<em class="unavailable">('.yii::t('main',$text).')</em>';
    }
    static public function price($value, $currency = null) {
        return Yii::app()->NumberFormatter->formatCurrency(
            round($value, 2),
            $currency ? $currency : yii::app()->params["currency"]
        );
    }
    static public function agrmTitle($agrmid) {
        $v = yii::app()->lanbilling->agreements[$agrmid];
        return array('Agreement: {agrmnum} {link}', array(
            '{agrmnum}' => $v->number,
            '{link}' => '<span class="content-header-side">'.yii::t('main','Balance') . ': ' .  self::price($v->balance)  . ' (' .
                CHtml::link(
                yii::t('main','Replenish the balance'),
                array(
                    'payment/pay'
                )
            ) . ')</span> '
        ));
    }
    static public function kbToMb($val) {
        $shapes = array();
        if (is_scalar($val)) {
            $val = array($val);
        }
        foreach ($val as $shape) {
            $shapes[] = str_replace(
                '.',
                ',',
                round(($shape / 1024), 3)
            );
        }
        return implode('/', array_unique($shapes)) . ' ' . yii::t('main', 'Mb');
    }
}

?>
