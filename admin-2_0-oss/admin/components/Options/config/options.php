<?php 
return array(
    array(
        'idx' => 1,
        'descr' => 'Database storing',
        array (
            'name' => 'day',
            'type' => 'numeric'
        ),
        array (
            'name' => 'month',
            'type' => 'numeric'
        ),
        array (
            'name' => 'vg_blocks',
            'type' => 'numeric'
        ),
        array (
            'name' => 'eventlog',
            'type' => 'numeric'
        ),
        array (
            'name' => 'balances',
            'type' => 'numeric'
        ),
        array (
            'name' => 'bills',
            'type' => 'numeric'
        ),
        array (
            'name' => 'orders',
            'type' => 'numeric'
        ),
        array (
            'name' => 'rentcharge',
            'type' => 'numeric'
        ),
        array (
            'name' => 'pay_cards',
            'type' => 'numeric'
        )
    ),
    array(
        'idx' => 2,
        'descr' => 'Cerber crypt',
        array (
            'name' => 'use_cerbercrypt',
            'type' => 'bool'
        ),
        array (
            'name' => 'cerber_host',
            'type' => 'text'
        ),
        array (
            'name' => 'cerber_login',
            'type' => 'text'
        ),
        array (
            'name' => 'cerber_pass',
            'type' => 'text'
        ),
        array (
            'name' => 'cerber_port',
            'type' => 'numeric'
        ),
        array (
            'name' => 'cerber_subscribers_amount',
            'type' => 'text'
        )
    ),
    array(
        'idx' => 3,
        'descr' => 'Payments',
        array (
            'name' => 'auto_transfer_payment',
            'type' => 'text'
        ),
        array (
            'name' => 'payment_format',
            'type' => 'text'
        ),
        array (
            'name' => 'pay_import',
            'type' => 'text'
        ),
        array (
            'name' => 'payment_script_path',
            'type' => 'text'
        ),
        array (
            'name' => 'tax_value',
            'type' => 'text'
        ),
        array (
            'name' => 'payments_cash_now',
            'type' => 'text'
        )
    ),
    array(
        'idx' => 4,
        'descr' => 'Common',
        array (
            'name' => 'default_operator',
            'type' => 'list',
            'descr' => 'Operator by default',
            'valuedescr' => 'getAccount'
        ),
        array (
            'name' => 'use_operators',
            'type' => 'bool',
            'descr' => 'Agential mode in telephony'
        ),
        array (
            'name' => 'wrong_active',
            'type' => 'numeric',
            'descr' => 'Restrict wrong payment card activation'
        ),
        array (
            'name' => 'export_character',
            'type' => 'list',
            'descr' => 'Statistic export encoding',
            'valuedescr' => 'getExporCharacter'
        ),
        array (
            'name' => 'session_lifetime',
            'type' => 'numeric',
            'descr' => "Limit managers' passive sessions (sec)"
        ),
        array (
            'name' => 'disable_change_user_agreement',
            'type' => 'bool',
            'descr' => "Forbid changing user agreement"
        )  
    ),
    array(
        'idx' => 5,
        'descr' => 'Financial statements',
        array (
            'name' => 'default_legal',
            'type' => 'list',
            'descr' => 'Default prepayed document for the legal person',
            'valuedescr' => 'getDocuments'
        ),
        array (
            'name' => 'default_physical',
            'type' => 'list',
            'descr' => 'Default prepayed document for the physical person',
            'valuedescr' => 'getDocuments'
        ),
        array (
            'name' => 'templates_dir',
            'type' => 'text',
            'descr' => 'Templates path'
        ),
        array (
            'name' => 'pay_import_delim',
            'type' => 'text',
            'descr' => 'ASCII-code for pay import delimiter'
        ),
        array (
            'name' => 'lock_period',
            'type' => 'month',
            'descr' => 'Locked period'
        ),
        array (
            'name' => 'default_country',
            'type' => 'list',
            'descr' => 'Origin country',
            'valuedescr' => 'getCountry'
        ),
        array (
            'name' => 'reset_ord_numbers',
            'type' => 'bool',
            'descr' => 'Start numbering documents from the beginning of the year'
        )
    ),
    array(
        'idx' => 6,
        'descr' => 'Users',
        array (
            'name' => 'change_usertype',
            'type' => 'bool',
            'descr' => 'Deny to change user type'
        ),
        array (
            'name' => 'disable_change_user_agenttype',
            'type' => 'bool',
            'descr' => 'Deny to change agent'
        ),
        array (
            'name' => 'disable_change_user_agreement',
            'type' => 'bool',
            'descr' => 'Deny to change agreement'
        ),
        array (
            'name' => 'user_viewpayed',
            'type' => 'bool',
            'descr' => 'Forbid displaying paid invoices to users'
        ),
        array (
            'name' => 'user_gendoc',
            'type' => 'bool',
            'descr' => 'Allow users to render prepayed invoices'
        ),
        array (
            'name' => 'session_lifetime',
            'type' => 'numeric',
            'descr' => 'Limit managers passive sessions'
        ),
        array (
            'name' => 'autoload_accounts',
            'type' => 'bool',
            'descr' => 'Load lists of users and account entries when opening sections'
        ),
        array (
            'name' => 'user_pass_symb',
            'type' => 'text',
            'descr' => 'Admissible characters in user password'
        ),
        array (
            'name' => 'acc_pass_symb',
            'type' => 'text',
            'descr' => 'Admissible characters in account entry password'
        ),
        array (
            'name' => 'generate_pass',
            'type' => 'bool',
            'descr' => 'Generate passwords'
        ),
        array (
            'name' => 'pass_length',
            'type' => 'numeric',
            'descr' => 'Password length'
        ),
        array (
            'name' => 'pass_numbers',
            'type' => 'bool',
            'descr' => 'Numbers only'
        )
    ),
    array(
        'idx' => 7,
        'descr' => 'Cyberplat',
        array (
            'name' => 'cyberplat_common_agreement',
            'type' => 'text'
        ),
        array (
            'name' => 'cyberplat_agreement_regexp',
            'type' => 'text'
        )
    ),
    array(
        'idx' => 8,
        'descr' => 'Smartcards',
        array (
            'name' => 'smartcard_usbox_tag',
            'type' => 'text',
            'descr' => 'Tag of category'
        ),
        array (
            'name' => 'smartcard_eqip_max',
            'type' => 'numeric'
        ),
        array (
            'name' => 'usbox_eqip_min',
            'type' => 'numeric'
        )
    ),
    array(
        'idx' => 9,
        'descr' => '',
        array (
            'name' => 'print_sales_mebius',
            'type' => 'text'
        ),
        array (
            'name' => 'print_sales_ocur',
            'type' => 'text'
        ),
        array (
            'name' => 'print_sales_ocfiz',
            'type' => 'text'
        ),
        array (
            'name' => 'print_sales_template',
            'type' => 'text'
        )
    ),
    array(
        'idx' => 10,
        'descr' => 'Agreements',
        array(
            "name" => '/^agrmnum_template_[0-9]+$/',
            "type" => "text"
        )
    )
);
?>
