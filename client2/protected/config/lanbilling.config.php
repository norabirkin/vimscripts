<?php
/**
 * Main application config
 */
return array(
    // Путь к ЛК2
    'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
    // Название личного кабинета, которое отображается в заголовке окна браузера
    'name'=>'LanBilling Client UI',
    // Название темы личного кабинета. Соответствует названию папки содержащей тему, расположенной в папке client2/themes/ 
    'theme' => 'LANBilling',
    'defaultController'=>'site',
    // Язык локализации
    'language' => 'ru',
    'preload'=>array('log','lanbilling','LB'),
    'onBeginRequest' => array(
        'LB_Plugins',
        'attachPlugins'
    ),
    'import'=>array(
        'application.components.profile.Profile_PhoneMask',
        'application.models.*',
        'application.components.cache.*',
        'application.components.grid.*',
        'application.components.block.helpers.*',
        'application.components.infoblock.*',
        'application.components.controller.*',
        'application.components.sbss.*',
        'application.components.vgroups.*',
        'application.components.tabs.*',
        'application.components.services.*',
        'application.components.datepicker.LB_DatePicker_Period',
        'application.components.*',
        'application.components.googleAnalitics.*',
        'application.components.kcaptcha.Kcaptcha',
        'application.components.menu.LBUserMenu',
        'application.components.page.LBPage',
        'application.components.page.LBPages',
        'application.components.wizard.*',
        'application.extensions.*',
        'application.modules.Antivirus.components.Antivirus',
        'application.extensions.helpers.*',
    ),

    'modules'=>array(
        'Antivirus' => array(
            'import' => array(
                'application.modules.Antivirus.controllers.*',
                'application.modules.Antivirus.components.*'
            ), 
            'components' => array(
                "Antivirus" => array( 
                    "class" => "Antivirus",
                    "categoryPrefix" => "Antivirus#"
                ),
                "AvailableAntivirusServicesGrid" => array( "class" => "AvailableAntivirusServicesGrid" ),
                "AssignedAntivirusServicesGrid" => array( "class" => "AssignedAntivirusServicesGrid" )
            )
        ),
        /**
         * 
         *    packages - Список UUID, которые считаются пакетами
         *             UUID - Идентификатор внешней услуги в категории тарифа
         * Следует установить menu_television => true
         */
        
        'DTV' => array(
            //'packages'=>array(),
            'import' => array(
                'application.modules.DTV.controllers.smartcards.UpdateDTVServices',
                'application.modules.DTV.components.*'
            ), 
            'components' => array(
                    'equipment' => array( 'class' => 'application.modules.DTV.components.Equipments' ),
                'TVPackagesGrid' => array('class' => 'application.modules.DTV.components.TVPackagesGrid'),
                'AvailableTVPackagesGrid' => array('class' => 'application.modules.DTV.components.AvailableTVPackagesGrid'),
                'AssignedTVPackagesGrid' => array('class' => 'application.modules.DTV.components.AssignedTVPackagesGrid'),
                'SmartCardTabs' => array('class' => 'application.modules.DTV.components.SmartCardTabs'),
                'PersonalTVGrid' => array('class' => 'application.modules.DTV.components.PersonalTVGrid'),
                'TVChannelsToAssignGrid' => array('class' => 'application.modules.DTV.components.TVChannelsToAssignGrid'),
                'SelectedTVChannelsGrid' => array('class' => 'application.modules.DTV.components.SelectedTVChannelsGrid'),
                'TVChannelsToStopGrid' => array('class' => 'application.modules.DTV.components.TVChannelsToStopGrid'),
                'TVChannelsToUpdateHiddenFields' => array('class' => 'application.modules.DTV.components.TVChannelsToUpdateHiddenFields')
            ) 
        ),
        'RentSoft' => array(
            'components' => array(
                'rentsoft' => array(
                    'class' => 'application.modules.RentSoft.components.RentSoftClientAPI',
                    'log_all' => true,
                    // Path to LANBilling admin interface (for admin's SOAP).
                    "lanbilling_admin" => realpath(dirname(__FILE__).DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'admin'),
                    // Login and password for LANBilling admin
                    "lanbilling_login_password" => "admin:",
                    // Secret string, must not be said to anybody!
                    "secret" => "b524cba3461c07c5eab6127a",
                    // Operator unique name.
                    // If you need to vary AG_NAME depending on abonent's operatior ID, 
                    // use syntax: "123:firstagname 456:secondagname" where 123 and 456 
                    // are operator's IDs.
                    "ag_name" => "lanbillingru",
                    // Tariff ID created for all RentSoft vgroups.
                    "lanbilling_tarif_id" => 652,
                    // For what types of account service is allowed? 
                    // ( 1 - juridical, 2 - physical ).
                    "allow_for_account_types" => array(),
                    // Specify agent IDs (settings.id in MySQL database) 
                    // for which subscription service is allowed only (if empty, use standard 
                    // LANBilling method to detect Internet-based agents via agenttype).
                    "only_agent_ids" => array(),
                    // If you have many UsBox agents, specify ID of those which is
                    // needed to bind subscriptions to.
                    "usbox_agent_id" => "",
                    // Allow subscription creation/charges only if it results to MORE than 
                    // this amount of money on balance. You may specify a negative value here 
                    // to allow abonent to go into minus on his account: in this case do not
                    // forget to set "Blokirovka uslugi" to "Net" at subscription tariff
                    // properties referred by LANBILLING_TARIFF_ID above.
                    "min_balance_allowed" => 0,
                    // Deprecated. Not used anymore.
                    "api_url" => "",
                    // For debugging only, do not change.
                    "dev_domain_suffix" => "",
                    "width" => NULL,
                    "height" => "500px"
                ),
            )
        ),
        
        /**
         * Модуль TURBO-интернета
         */
        'turbo' => array(
            // Показывать страницу с условиями оспользования турбо-кнопки
            'terms' => true,
            // Показыавть таблицу с текущими заказами TURBO-интернета
            'showCurrentTurbo' => true,
            // Минимальный срок заказа
            'minDuration' => 1,
            // Максимальный срок заказа
            'maxDuration' => 30,
            // Default: '/^turbo_/'
            'categoryPrefix' => '/^turbo_/',
        )/*,
        'next' => array(
            'terms' => true
        ),
        'multinight' => array(
            'terms' => true
        ),
        'get_all' => array(
            'terms' => true
        ),
        'x30' => array(
            'terms' => true
        ),
        'turbo_on' => array(
            'terms' => true
        )*/
    ),

    // Системные настройки. Редактируйте только при наличии соответствующих знаний.
    'components'=>array(
    'auth' => array('class' => 'AuthHelper'),
    'start' => array('class' => 'AppInitHelper'),
    'block' => array('class' => 'Block'),
    'ServicesDataReader' => array('class' => 'ServicesDataReader'),
    'WebmoneyPayment' => array('class' => 'WebmoneyPayment'),
    'PromisedPayment' => array('class' => 'PromisedPayment'),
    'PaymasterPayment' => array('class' => 'PaymasterPayment'),
    'AssistPayment' => array('class' => 'AssistPayment'),
    'Services' => array(
        'class' => 'application.components.ServicesList'
    ),
    'SessionStore' => array(
        'class' => 'application.components.SessionStore'
    ),
    'grid' => array(
            'class'=>'application.components.grid1'
        ),
        'LB'=>array(
            'class'=>'ext.LB.components.LB',
            'coreCss'=>false
        ),
        'lanbilling'=>array(
            'class'=>'ext.LANBilling',
        ),
        'cache'=>array(
            'class'=>'system.caching.CFileCache',
        ),
        'user'=>array(
            'allowAutoLogin'=>true,
            'loginRequiredAjaxResponse' => '{"unauthorized":true}',
            'loginUrl'=>array('site/login'),
        ),
        'errorHandler'=>array(
            'errorAction'=>'site/error',
        ),
        'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                'access' => array(
                    'enabled' => false,
                    'class'   => 'CFileLogRoute',
                    'logFile'    => 'access.log',
                    'categories' => 'access.*',
                ),
                'error' => array(
                    'enabled' => true,
                    'class'   => 'CFileLogRoute',
                    'logFile'    => 'error.log',
                    'categories' => 'error.*',
                ),
                'firebug' => array(
                    'enabled' => false,
                    'class' => 'CWebLogRoute',
                    'showInFireBug' => true,
                    'categories' => 'dev.*'
                ),
                'file' => array(
                    'enabled' => true,
                    'class'      => 'CFileLogRoute',
                    'logFile'    => 'dev.log',
                    'categories' => 'dev.*'
                ),
                'apache' => array(
                    'enabled' => true,
                    'class' => 'application.components.ApacheErrorLogRoute',
                    'levels' => 'error'
                )
            ),
        ),
        'widgetFactory'=>array(
            'widgets'=>array(
                'CLinkPager'=>array(
                    // Максимальное число кнопок в списке страниц
                    'maxButtonCount' => 5,
                    'cssFile' => false,
                    'header' => ''
                ),
            ),
        ),

    ),

    /**
     * Interface global configuratios
     * Provides global permitions or view configuration
     *
     * Внимание! Во избежание потери изменений конфигурации, рекомендуется скопировать данный файл в домашнюю папку биллинга (/usr/local/billing)
     * с именем файла "client.main.php" и уже в него вносить изменения.
     *
     * using: Yii::app()->params['paramName']
     */
    'params'=>array(
        'allow_change_usbox_tariff' => false,
        'utility_stat_enabled' => false,
        'utility_stat_external' => true,
        'utility_stat_external_name' => 'Показания прибора',
        'utility_stat_date' => true,
        'utility_stat_date_name' => 'Дата снятия показаний',
        'logUid' => 0,
        'MoscowBank' => array(
            'DESC' => 'Some description',
            'MERCH_NAME' => 'Some name',
            'MERCH_URL' => 'http://somesite.com',
            'MERCHANT' => '2343872934987',
            'TERMINAL' => '2398742',
            'COUNTRY' => 'ru',
            'LANG' => 'ru',
            'key' => '2507AAB01384F932FD738',
            //'acquirer_url' => 'http://localhost/client20/index.php?r=payment/test'
            'acquirer_url' => 'https://3ds2.mmbank.ru/cgi-cred-bin/cgi_link'
        ),
        
        'yandexMoney' => array(
            'shopId' => 92,
            'scid' => 20375,
            'operatorURL' => 'http://localhost/client20/index.php?r=payment/test'
        ),
        'infoblock' => array(
            'tariff' => true,
            'payment' => true,
            'lock' => true,
            'message' => true,
            'service' => true
        ),
        'paging' => array(
            'default_limit' => 5,
            'limit_select' => array(
                10,
                50,
                100,
                500
            )
        ),
        'turbo' => array(
            'longActionService' => false,
            'categoryPrefix' => '/^turbo_/',
            'minDuration' => 1,
            'maxDuration' => 30
        ),
        'connection' => array(
            'internet' => array(
                'url' => 'http://yiiframework.com',
                'description' => 'Описание страницы подключения к интернету',
                'text' => 'Подключение к интернету'
            ),
            'tv' => array(
                'iframe' => 'http://yiiframework.com',
                'description' => 'Описание страницы подключения к телевидению'
            ),
            'telephony' => array(
                'url' => 'http://sencha.com',
                'description' => 'Описание страницы подключения к телефонии',
                'text' => 'Подключение к телефонии'
            )
        ),
        'use_month_and_year_selects_on_charges_page' => true,
        'antivirusCategoryPrefix' => 'Antivirus#',
        // Текст, находящийся в разделе "Оплата услуг" под заголовком "Пополнить баланс"
        'balance_refill_text' => 'Вы можете пополнять свой лицевой счет удобным для Вас способом через платежные терминалы, через банк, со счета мобильного телефона или при помощи банковской карты',
        // Текст, находящийся в разделе "Оплата услуг" под заголовком "Обещанный платеж"
        'promised_payment_text' => 'Услуга «Обещанный платеж» позволяет пользоваться нашими услугами даже при отрицательном балансе.',
    // Использовать капчу
    'use_captcha' => false,
    'block' => array(
        // Разрешить пользовательскую блокировку учетной записи текущим моментом. При значении false будет разрешено выбрать дату не раньше следующего дня.
        'allow_block_immediately' => true,
        // Разрешить пользовательскую разблокировку учетной записи текущим моментом. При значении false будет разрешено выбрать дату не раньше следующего дня.
        'allow_unblock_immediately' => true
    ),
        // Показывать широковещательные сообщения
        'shared_posts' => true,
        // Количество показываемых широковещательных сообщений
        'shared_posts_main_limit' => 1,
        // Показывать историю широковещательных сообщений
        'shared_posts_history' => true,
        // Регулярное выражение, которому должен соответствовать UUID услуги ЖКХ. Используется в модуле ЖКХ.
        'zkhCategoryPrefix' => '/^zkh_/',
        // Название дополнительного поля учетной записи, содержащего серийный номер счетчика. Используется в модуле ЖКХ.
        'zkhSerialNumber' => 'device_serial',
        //URL формы подключения к домашнему телевидению
        'DTV_connection_form' => '',
        // Параметр управляющий возможностью пользователя менять свой номер телефона в контактных данных
        'editing_client_info' => array(
            'phone' => true,
            'email' => true,
            'phoneMask' => ''
        ),
        'client_info_editors_hint' => 'редактировать контактную информацию можно позвонив по телефону в контактный Call центр',
        // Показывать израсходованный трафик в таблице учетных записей на главной странице
        'show_consumed' => true,
        // Показывать текущую скорость в таблице учетных записей на главной странице
        'show_shape' => true,
        // Скрывать нулевые списания в статистике
        'hideStaticticsEntriesWithNoAmount' => true,
        // Не показывать израсходованный трафик для учетных записей с безлимитным тарифом 
        'hide_consumed_if_unlimited' => false,
        // Показывать ссылку на восстановление пароля на странице входа в личный кабинет
        'showRestorePassword' => false,
        // Показывать паспортные данные в разделе "Настройки"
        'showPersonalData' => false,
        // Редактировать банковские реквизиты
        'editBankDetails' => false,
        // Модули сервисных функций
        'service_function_modules' => array(    
            'next',
            'x30',
            'turbo_on',
            'get_all',
            'multinight'
        ),
/**
 * Способы оплаты доступные в разделе "Оплата услуг"
 */

        'payment_moscow' => false,
        'payment_yandexmoney' => false,
// Allow user pay in using assist payments
        'payment_assist' => true,
// Платежная система Paymaster 
        'payment_paymaster' => true,
// Allow user pay in using webmoney payments
        'payment_webmoney' => true,
// Allow user pay in using chronopay payments
        'payment_chronopay' => true,
// Карты оплаты
        'payment_cards' => true,
// Allow user promise sum of money to activate service
        'payment_promised' => true,
// Показывать поле "серийный номер" для способа оплаты "Карты оплаты"
        'require_card_serial' => true,
// Настройки способа оплаты WebMoney
        'webmoney' => array(
            'LMI_PAYEE_PURSE' => 'R49812459874',
            'LMI_SIM_MODE' => 0,
            'merchant_url' => 'https://merchant.webmoney.ru/lmi/payment.asp'
        ),
// Настройки способа оплаты PayMaster
        'paymaster' => array(
            'LMI_MERCHANT_ID' => 'R2058490398590',
            'LMI_SIM_MODE' => 0,
            'merchant_url' => 'https://paymaster.ru/Payment/Init'
        ),
// Настройки способа оплаты Assist
        'assist' => array(
            'Login' => 'some_login',
            'Password' => '23klwi29fR48wrER',
            'Merchant_ID' => '2358710',
            'TestMode' => 1,
            'merchant_url' => 'https://test.paysecure.ru/pay/order.cfm',
            'confirm_url' => 'https://test.paysecure.ru/charge/charge.cfm',
            //'merchant_url' => 'http://localhost/client2/index.php?r=payment/test',
            'requestMethod' => 'get' 
        ),
        
        // Показывать статистику по использованию системы внизу страницы
        'showUsageInfo' => false,
        // Информация о компании внизу страницы
        'companyInfo' => 'ООО&nbsp;&laquo;Your company&raquo; &copy;&nbsp;'.date('Y').'&nbsp;<br>Все права защищены',
        // Лимит отображения записей на странице. На данный момент используется в статистике.
        'PageLimit' => 5,
        // Валюта для форматирования сумм балансов. Default: RUB
        'currency' => 'RUB',

        /**
         * Настройки логирования
         */
            // Логи системы в папке client2/protected/runtime
            // Путь для сохранения
            // Логировать неуспешные попытки входа в систему
            'log_auth_error' => true,
            // Логировать успешные попытки входа в систему
            'log_auth_success' => false,

        /**
         * Настройки главного меню
         */
            'menu_profile' => true,
            'menu_sharedposts' => true,
            'menu_notices' => true,
            'menu_zkh' => false,
            'menu_internet' => true,
            'menu_telephony' => true,
            'menu_lockinghistory' => true,
            // Пункт меню Антивирус
            'menu_antivirus' => true,
            // Раздел по работе с Акциями
            'menu_promo' => true,
            // Пункт меню Оплата
            'menu_payments' => true,
            // Пункт меню Техническая поддержка
            'menu_helpdesk' => true,
            // Пункт меню Антивирусы и другое ПО
            'menu_rentsoft' => false,
            // Пункты меню Оборудование и Телевидение.
            // Доступно только при корректных настройках в административном интерфейсе
            'menu_television' => true,
            // Пункт меню База Знаний
            'menu_knowledges' => true,
            // Возможность пользователя изменять свой пароль в разделе "Настройки"
            'menu_password' => true,
            // Пункт меню MAC-адреса
            'menu_macadrresses' => true,
            // Пункт меню ТУРБОКНОПКА
            'menu_turbobutton' => true,
        /**
         * Общая настройка внешнего вида
         */
            // Отображать уведомление о неоплаченных документах в правом информационном блоке
            'unpaidorders_visible' => true,
            // Отображать уведомления о новых сообщениях HelpDesk в правом информационном блоке
            'main_note_helpdesk' => false,
            // Отображать сообщение о задолженности
            'showArrearsMessage' => true,

        /**
         * Изменение пароля для учетной записи
         */
            // Минимальное число символов в пароле
            'vgroup_password_minlength' => 3,
            // Максимальное число символов в пароле
            'vgroup_password_maxlength' => 128,

        /**
         * Настройки страницы "Мои аккаунты"
         */
            // Позволить пользователю менять пароль для учетных записей
            'vgroup_password_edit' => true,
            // Разрешить пользователю менять статус учетной записи - пользовательская блокировка (блокировать/разблокировать)
            'vgroup_change_status' => false,
            // Показывать ссылку на страницу смены тарифного плана
            'vgroup_schedule' => true,

        /**
         * Настройки страницы "Тарифы и услуги"
         */
            // Показывать ссылку на смену ТП
            'services_allow_change_tarif' => true,
            // Показывать ссылку на подключение услуг
            'services_allow_purchase_services' => true,
            // Текст со ссылкой на страницу описания тарифов
            // Разрешено использование HTML тегов. Можно оставить пустым.
            'services_tardescr_text' => 'Если Вы решили изменить тариф, но не знаете какой выбрать &mdash; воспользуйтесь <a href="http://mysite.ru/tarifs">подбором тарифов</a>.',

            /**
             * Настройки смены тарифного плана
             */
                // Запланировать смену тарифного плана разрешено не ранее первого числа календарного месяца, следующего за текущим
                // Разрешить смену тарифа не ранее первого числа следующего месяца
                // если FALSE, то можно менять с текущего дня.
                'schedule_month_start' => true,

                // Запланировать смену тарифного плана разрешено ТОЛЬКО с первого числа календарного месяца, следующего за текущим.
                'schedule_month_start_strict' => false,

                // Планирование смены тарифного плана разрешено через schedule_period_limit = N дней от текущего момента.
                // Default: 1, то есть смена тарифа разрешена только со следующего дня
                // Если schedule_period_limit = 0, то тариф можно изменить текущим временем
                // Данное условие срабатывает, только если schedule_month_start_strict = false и schedule_month_start = false
                // Условие: (ТекущаяДата + schedule_period_limit) < ДатаПланированияСменыТП
                'schedule_period_limit' => 0,

        /**
         * Настройка страницы статистики
         */
            // Разрешить просматривать статистику по адресам
            'stat_view_resources' => true,
            // Разрешить просматривать статистику по портам
            'stat_view_services' => true,

            // Период, отображаемый по-умолчанию в статистике. Default: d
            // d - день - рекомендуемое значение для снижения нагрузки на БД
            // w - неделя
            // m - месяц
            'statDatePeriod' => 'm',

    ),
);
