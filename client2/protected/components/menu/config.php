<?php
return array(
    array(
        'controller' => 'account',
        'action' => 'index',
        'title' => 'My accounts',
        'hidden' => true
    ),
    array(
        'controller' => 'profile',
        'param' => 'menu_profile',
        'action' => 'index',
        'title' => 'Profile'
    ),
    array(
        'controller' => 'payment',
        'action' => 'index',
        'title' => 'ServicePayment',
        'localize' => 'payment',
        'items' => array(
            array(
                'action' => 'pay',
                'title' => 'BalanceRefill',
                'description' => 'It is balance refill section, where you can refill your balance',
                'items' => array(
                    array(
                        'action' => 'moscow',
                        'localize' => 'main',
                        'title' => 'Moscow Bank',
                        'param' => 'payment_moscow',
                        'description' => 'It is section for Moscow Bank payment, where you can refill you balance using Moscow Bank payment system',
                    ),
                    array(
                        'action' => 'cards',
                        'title' => 'Pay cards',
                        'param' => 'payment_cards',
                        'description' => 'It is section for pay cards payment, where you can refill you balance using pay cards',
                    ),
                    array(
                        'action' => 'chronopay',
                        'param' => 'payment_chronopay',
                        'title' => 'ChronoPay payment system',
                        'localize' => 'main',
                        'description' => 'It is "ChronoPay" payment section, where you can refill your balance using "ChronoPay" payment system',
                    ),
                    array(
                        'action' => 'yandex',
                        'param' => 'payment_yandexmoney',
                        'title' => 'YandexMoney payment system',
                        'localize' => 'main',
                        'description' => 'It is "YandexMoney" payment section, where you can refill your balance using "WebMoney" payment system',
                    ),
                    array(
                        'action' => 'webmoney',
                        'param' => 'payment_webmoney',
                        'title' => 'WebMoney payment system',
                        'localize' => 'main',
                        'description' => 'It is "WebMoney" payment section, where you can refill your balance using "WebMoney" payment system',
                    ),
                    array(
                        'action' => 'paymaster',
                        'param' => 'payment_paymaster',
                        'title' => 'PayMaster payment system',
                        'localize' => 'main',
                        'description' => 'It is "PayMaster" payment section, where you can refill your balance using "PayMaster" payment system',
                    ),
                    array(
                        'action' => 'assist',
                        'param' => 'payment_assist',
                        'title' => 'Assist payment system',
                        'description' => 'It is "Assist" payment section, where you can refill your balance using "Assist" payment system',
                        'items' => array(
                            array(
                                'action' => 'assistconfirm',
                                'title' => 'Assist payment confirmation',
                                'localize' => 'main'
                            )
                        )
                    )
                )
            ),
            array(
                'action' => 'promised',
                'param' => 'payment_promised',
                'title' => 'PromisedPayment',
                'description' => 'It is promised payment section, where you can do promised payment'
            ),
            array(
                'action' => 'history',
                'title' => 'Payment history',
                'description' => 'It is payment history section, where you can see history of your payments'
            )
        )
    ),
    array(
        'controller' => 'invoice',
        'action' => 'index',
        'title' => 'Invoice',
        'items' => array(
            array(
                'action' => 'info',
                'title' => 'Balance info',
                'description' => 'It is the section where you can view balance info'
            ),
            array(
                'action' => 'charges',
                'title' => 'Expenses',
                'description' => 'It is the section where you can view expenses by period'
            ),
            array(
                'action' => 'list',
                'title' => 'Monthly bill',
                'description' => 'It is the section where you can view bill information',
                'controller' => 'documents'
            )
        )
    ),
    array(
        'controller' => 'internet',
        'action' => 'index',
        'param' => 'menu_internet',
        'title' => 'Home internet',
        'items' => array(
            array(
                'controller' => 'internet',
                'action' => 'connection',
                'title' => 'Connection',
                'description' => yii::app()->params['connection']['internet']['description']
            ),
            array(
                'action' => 'tariffChanging',
                'title' => 'Tariff changing',
                'description' => 'It is tariff changing section, where you can change tariff.',
            ),
            array(
                'action' => 'tariffHistory',
                'title' => 'Tariffs history',
                'description' => 'It is tariffs history section, where you can see tariffs history.'
            ),
            array(
                'action' => 'statistics',
                'title' => 'Statistics',
                'description' => 'It is statistics section, where you can see internet statistics.'
            ),
            array(
                'action' => 'turbo',
                'title' => 'Turbo button',
                'param' => 'menu_turbobutton',
                'description' => 'It is turbo button section, where you can assing turbo button service.'
            ),
            array(
                'action' => 'mac',
                'title' => 'MAC-addresses',
                'description' => 'It is MAC-addresses section, where you can change MAC-addresses',
                'param' => 'menu_macadrresses'
            )
        )
    ),
    array(
        'controller' => 'phone',
        'action' => 'index',
        'param' => 'menu_telephony',
        'title' => 'Telephony',
        'items' => array(
            array(
                'action' => 'connection',
                'title' => 'Connection',
                'description' => yii::app()->params['connection']['telephony']['description']
            ),
            array(
                'action' => 'tariffChanging',
                'title' => 'Tariff changing',
                'description' => 'It is tariff changing section, where you can change tariff.'
            ),
            array(
                'action' => 'tariffHistory',
                'title' => 'Tariffs history',
                'description' => 'It is tariffs history section, where you can see tariffs history.'
            ),
            array(
                'action' => 'statistics',
                'title' => 'Statistics',
                'description' => 'It is statistics section, where you can see internet statistics.'
            )
        )
    ),
    array(
        'controller' => 'dtv',
        'title' => 'Home TV',
        'action' => 'index',
        'param' => 'menu_television',
        'localize' => 'tv',
        'items' => array(
            array(
                'controller' => 'dtv',
                'localize' => 'main',
                'action' => 'connection',
                'description' => 'It is section, where yout can connect Home TV',
                'title' => 'Connection'
            ),
            array(
                'controller' => 'dtv',
                'action' => 'equipment',
                'title' => 'Equipment',
                'description' => 'Это раздел с данными по оборудованию' //# Локализовать
            ),
            array(
                //'action' => 'smartcards',
                'controller' => 'dtv',
                'action' => 'channels',
                'title' => 'TV Channels',
                'description' => 'Это раздел с данными по ТВ-каналам' //# Локализовать
            ),
            array(
                'action' => 'additional',
                'title' => 'Additional services',
                'description' => 'Это раздел, где вы можете подключить дополнительные услуги'
            )
        )
    ),
    array(
        'controller' => 'other',
        'action' => 'index',
        'title' => 'Other services',
        'items' => array(
            array(
                'action' => 'tariffChanging',
                'param' => 'allow_change_usbox_tariff',
                'title' => 'Tariff changing',
                'description' => 'It is tariff changing section, where you can change tariff.',
            )
        )
    ),
    array(
        'controller' => 'RentSoft/default',
        'action' => 'index',
        'title' => 'Antiviruses and other software',
        'param' => 'menu_rentsoft'
    ),
    array(
        'controller' => 'Zkh',
        'action' => 'index',
        'title' => 'ZKH',
        'param' => 'menu_zkh'
    ),
    array(
        'controller' => 'block',
        'action' => 'index',
        'title' => 'Locking',
        'items' => array(
            array(
                'action' => 'managing',
                'title' => 'Locking managing',
                'description' => 'This is the section, where you can manage account state',
                'param' => 'vgroup_change_status'
            ),
            array(
                'action' => 'history',
                'title' => 'Locking history',
                'description' => 'This is the section, where you can view locking history',
                'param' => 'menu_lockinghistory'
            )
        )
    ),
    array(
        'controller' => 'password',
        'action' => 'index',
        'title' => 'Password changing',
        'localize' => 'main'
    ),
    array(
        'controller' => 'antivirus',
        'param' => 'menu_antivirus',
        'action' => 'index',
        'title' => 'Antivirus',
    	'configurateAntivirusTitleFromTheme' => true,
        'items' => array(
            array(
                'action' => 'fail',
                'title' => 'Error',
                'hidden' => true,
                'description' => 'Antivirus is switched off'
            )
        )
    ),
    array(
        'controller' => 'promo',
        'action' => 'index',
        'title' => 'Promo',
        'localize' => 'promo',
        'param' => 'menu_promo',
        'items' => array (
            array (
                'action' => 'currentPromotionsList',
                'title' => 'Current promotions',
                'description' => 'Current active promotions'
            ),
            array (
                'action' => 'availablePromotionsList',
                'title' => 'AvailableActions',
                'description' => 'Promotions available for subscribe'
            )
        )
    ),  
    array(
        'controller' => 'support',
        'action' => 'index',
        'param' => 'menu_helpdesk',
        'title' => 'Support',
        'localize' => 'support'
    ),
    array(
        'controller' => 'helpdesk',
        'action' => 'index',
        'param' => 'menu_helpdesk',
        'title' => 'Support'
    ),
    array(
        'controller' => 'sharedposts',
        'addSharedPostsCategoriesHere' => true,
        'action' => 'index',      
        'title' => 'Messages',
        'localize' => 'messages',
        'param' => 'menu_sharedposts',
        'items' => array (
            array (
                'action' => 'notices',
                'param' => 'menu_notices',
                'title' => 'Notices',
                'description' => 'Here you can manage your notification messages'
            )
        )
    ),
    array(
        'controller' => 'site',
        'action' => 'logout',
        'title' => 'Logout',
        'localize' => 'main'
    )
);

?>
