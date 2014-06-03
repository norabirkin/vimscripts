<?php return array(
    'enabled' => true,
    'meta_ga_region' => 'primorye',
    'meta_ga_section' => 'lk_fix',
    'head' => array(
        'http://www.google-analytics.com/ga.js'
    ),
    'body' => array(
        'http' => array(
            //'http://static.mts.ru/upload/images/js/GoogleAnalytics_v2.0.3.0.js'
            Yii::app()->baseUrl.'/js/GoogleAnalytics_v2.0.3.0.js'
        ),
        'https' => array(
            //'http://static.ssl.mts.ru/upload/images/js/GoogleAnalytics_v2.0.3.0.js',
            Yii::app()->baseUrl.'/js/GoogleAnalytics_v2.0.3.0.js'
        )
    ),
    'lookup' => array(
        'notification/index' => true,
        'invoice/info' => true,
        'payment/history' => true,
        'payment/index' => true,
        'payment/promised' => true,
        'payment/assist' => true,
        'internet/index' => true,
        'internet/connection' => true,
        'internet/tariffChanging' => true,
        'internet/tariffHistory' => true,
        'dtv/index' => true
    )

); ?>
